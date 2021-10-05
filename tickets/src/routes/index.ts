import express, { Request, Response } from "express";
import { Ticket } from "../models/Ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  // Get all tickets, query with the mongoose model
  const tickets = await Ticket.find({});
  // Return the tickets
  return res.status(200).json({
    tickets: tickets,
  });
});

export { router as getAllTicketsRouter };
