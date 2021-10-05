import express, { Request, Response } from "express";

import { NotFoundError } from "@v0x-shared/common";

import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findOne({ _id: id });

  if (!ticket) {
    throw new NotFoundError("Ticket is not found");
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
