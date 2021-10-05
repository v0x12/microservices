import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from "@v0x-shared/common";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_MINUTES = 15;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // 1. Get the ticket the user is trying to order in the database
    const ticket = await Ticket.findOne({ _id: ticketId });
    // 2. Check if ticket is reserved or not.
    if (!ticket) throw new NotFoundError("Ticket is not found!");
    // 3. Make sure the ticket is not reserved yet.
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("This ticket is already reserved.");
    }
    // 4. Calculate and expiration date for the order.
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + EXPIRATION_WINDOW_MINUTES * 60
    );
    // 5. Build the order and save it to the database.
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });
    await order.save();
    // 6. Publish an event about order was created.
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Created,
      userId: req.currentUser!.id,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    // 7. Send a response about the order
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
