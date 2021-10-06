import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
  validateRequest,
} from "@v0x-shared/common";

import { Ticket } from "../models/Ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
router.put(
  "/api/tickets/:ticketId",
  requireAuth,
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Ticket name is required.")
      .isLength({ min: 3, max: 20 })
      .withMessage("Your ticket name need to be between 3 and 20 characters."),
    body("price")
      .trim()
      .isFloat({ gt: 0.5, lt: 10000 })
      .withMessage("Only numbers can be provided for price"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.params;
    const { title, price } = req.body;

    const ticket = await Ticket.findOne({ _id: ticketId });

    if (!ticket) throw new NotFoundError("Ticket is not found.");

    const notOwnThisTicket = req.currentUser?.id === ticket?.userId;
    if (!notOwnThisTicket)
      throw new NotAuthorizedError("You not own this ticket");
    else {
      ticket.set({
        title: title,
        price: price,
      });
      await ticket.save();

      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: req.currentUser!.id,
        version: ticket.version
      });
    }

    res.send({ ticket: ticket });
  }
);

export { router as ticketUpdateRouter };
