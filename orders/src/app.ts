import express from "express";
import "express-async-errors";

import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@v0x-shared/common";

import { indexOrderRouter } from "./routes";
import { createOrderRouter } from "./routes/new";
import { updateOrderRouter } from "./routes/update";
import { deleteOrderRouter } from "./routes/delete";
import { showOrderRouter } from "./routes/show";

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

app.use(currentUser);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(createOrderRouter);
app.use(updateOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError("Route path not found."));
});

app.use(errorHandler);
