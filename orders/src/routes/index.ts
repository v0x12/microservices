import { NotFoundError, requireAuth } from "@v0x-shared/common";
import express, { Request, Response } from "express";
import { Order } from "../models/Order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket"
  );

  if (orders.length <= 0) {
    throw new NotFoundError("You don't have any orders yet!");
  }

  res.send(orders);
});

export { router as indexOrderRouter };
