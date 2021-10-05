import express from "express";
import "express-async-errors";

import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@v0x-shared/common";

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { getAllTicketsRouter } from "./routes/index";
import { ticketUpdateRouter } from "./routes/update";

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(getAllTicketsRouter);
app.use(ticketUpdateRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError("Route path not found."));
});

app.use(errorHandler);
