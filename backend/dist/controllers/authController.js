"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const entities_1 = require("src/models/entities");
const argon2_1 = __importDefault(require("argon2"));
const maxAge = 21 * 12 * 30 * 24 * 60 * 60;
const createToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, "jwttoken", {
        expiresIn: maxAge,
    });
};
module.exports.signup_get = (_req, res) => {
    res.render("signup");
};
module.exports.login_get = (_req, res) => {
    res.render("login");
};
module.exports.signup_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password: plainPassword, role } = req.body;
    const password = yield argon2_1.default.hash(plainPassword);
    if (!(role === "customer" || role === "restaurant")) {
        res.status(400).json({ role: "invalid role" });
    }
    try {
        const user = yield entities_1.User.create({ email, password, role });
        yield user.save();
        const token = createToken(user.id, role);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user.id, token });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
});
module.exports.login_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield entities_1.User.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});
module.exports.logout_get = (_req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
};
//# sourceMappingURL=authController.js.map