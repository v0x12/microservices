import express from "express";
import "express-async-errors";

import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "@v0x-shared/common";
import { NotFoundError } from "@v0x-shared/common";

export const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    name: "session",
    secure: process.env.NODE_ENV !== "test",
    signed: false,
  })
);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError("Route path not found."));
});

app.use(errorHandler);
