import { User } from "../models/User";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@v0x-shared/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .isLength({ min: 6, max: 20 })
      .withMessage("Password muse be between 6 and 20 characters!!!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      throw new BadRequestError("User already exists.");
    }

    const user = User.build({
      email: email,
      password: password,
    });
    await user.save();

    const payLoad = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payLoad, process.env.JWT_KEY!);
    req.session!.jwt = token;

    res.status(201).send({ user });
  }
);

export { router as signUpRouter };
