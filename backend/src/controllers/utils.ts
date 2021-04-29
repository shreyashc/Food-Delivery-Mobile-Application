import { env } from "src/env";
import jwt from "jsonwebtoken";

const MAX_AGE = 21 * 12 * 30 * 24 * 60 * 60;
const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, env.app.accessTokenSecret, {
    expiresIn: MAX_AGE,
  });
};

export { generateToken, MAX_AGE };
