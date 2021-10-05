import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@v0x-shared/common";
import { Order } from "./../models/Order";
import express, { Request, Response } from "express";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError("Order is not found.");
    }

    const checkOrderOwner = order.userId === req.currentUser!.id;
    if (!checkOrderOwner) {
      throw new NotAuthorizedError("You not own this order!");
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
