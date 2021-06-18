import { env } from "../env";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { Customer, Restaurant, User } from "../models/entities";
import firebase from "../firebase/config";
import { v4 as uuid } from "uuid";

import multer2 from "multer";

const MAX_AGE = 21 * 12 * 30 * 24 * 60 * 60;

/**
 * @param  {number} id
 * @param  {string} role
 * @param  {string} email
 */
const generateToken = (
  id: number,
  role: string,
  email: string,
  options?: {
    customerId?: number;
    restaurantId?: number;
  }
) => {
  let tokenBody: any = { id, role, email };
  if (options?.customerId) {
    tokenBody["cutomerId"] = options.customerId;
  }
  if (options?.restaurantId) {
    tokenBody["restaurantId"] = options.restaurantId;
  }
  return jwt.sign(tokenBody, env.app.accessTokenSecret, {
    expiresIn: MAX_AGE,
  });
};

/**
 * @param  {string} email
 * @param  {string} plainPassword
 * @param  {"customer"|"restaurant"} role
 * @param  {{restaurantDet?:restaurantDetIntf;customerDet?:customerDetInt;}} options
 */
const signUpUser = async (
  email: string,
  plainPassword: string,
  role: "customer" | "restaurant",
  options: {
    restaurantDet?: restaurantDetIntf;
    customerDet?: customerDetInt;
  }
) => {
  const password = await argon2.hash(plainPassword);
  try {
    const user = await User.create({ email, password, role });
    await user.save();
    let returningUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    if (role === "restaurant" && options.restaurantDet) {
      const rating = parseFloat((Math.random() * (5.0 - 3.7) + 3.7).toFixed(1));

      await Restaurant.create({
        userId: user.id,
        rating,
        ...options.restaurantDet,
      }).save();
    } else if (role === "customer" && options.customerDet) {
      //customer
      await Customer.create({
        userId: user.id,
        ...options.customerDet,
      }).save();
    }
    return { savedUser: returningUser, error: null };
  } catch (err) {
    if (err?.code === "23505") {
      return {
        loggedInUser: null,
        error: { message: "Email already registered" },
      };
    }
    return { savedUser: null, error: err };
  }
};

/**
 * @param  {string} email
 * @param  {string} plainPassword
 */
const loginUser = async (email: string, plainPassword: string) => {
  try {
    const user = await User.findOne({
      where: { email: email },
      relations: ["customer"],
    });

    if (!user) {
      const error = {
        field: "Email",
        message: "Email not registered",
      };
      return { loggedInUser: null, error };
    }

    const valid = await argon2.verify(user.password, plainPassword);

    if (!valid) {
      const error = {
        field: "Password",
        message: "incorrect password",
      };
      return { loggedInUser: null, error };
    }
    return {
      loggedInUser: {
        id: user.id,
        email: user.email,
        role: user.role,
        customer: user.customer,
      },
      error: null,
    };
  } catch (error) {
    return { loggedInUser: null, error };
  }
};

const multer = multer2({
  storage: multer2.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const getImageURL = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }

    const filename = `${file.originalname}_${Date.now()}`;

    const bucket = firebase.storage().bucket();
    const fileUpload = bucket.file("foodzy/" + filename);
    const token = uuid();

    const blobStream = fileUpload.createWriteStream({
      gzip: true,
      resumable: false,
      contentType: file.mimetype,
      public: true,
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    blobStream.on("error", () => {
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
      const url = new URL(
        `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/foodzy%2F${filename}?alt=media&token=${token}`
      );
      resolve(url.toString());
    });

    blobStream.end(file.buffer);
  });
};

interface restaurantDetIntf {
  displayName?: string;
  phone?: string;
  address?: string;
  imgUrl?: string;
  city?: string;
  category?: string;
  isVeg?: boolean;
}

interface customerDetInt {
  displayName?: string;
  phone?: string;
  address?: string;
}

export { generateToken, MAX_AGE, signUpUser, loginUser, getImageURL, multer };

// https://firebasestorage.googleapis.com/v0/b/gallery-e29e9.appspot.com/o/foodzy%2Fimage%20with%20spaces.jpg_1623933191365?alt=media&token=940c2a02-f9f8-4a0c-a777-abdf465c1ba0

// me
// https://firebasestorage.googleapis.com/v0/b/gallery-e29e9.appspot.com/o/foodzy/image%20with%20spaces.jpg_1623933191365?alt=media&token=940c2a02-f9f8-4a0c-a777-abdf465c1ba0
