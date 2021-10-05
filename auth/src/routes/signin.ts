import express, { Request, Response } from "express";

import { User } from "../models/User";
import Password from "../services/Password";
import jwt from "jsonwebtoken";

import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@v0x-shared/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password").trim().notEmpty().withMessage("Password is required."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) throw new BadRequestError("Login request failed.");

    if (await Password.compare(password, user.password)) {
      const payLoad = {
        id: user._id,
        email: user.email,
      };

      const token = jwt.sign(payLoad, process.env.JWT_KEY!);
      req.session!.jwt = token;

      return res.status(200).json(user);
    }
    throw new BadRequestError("Invalid credentials.");
  }
);

export { router as signInRouter };
