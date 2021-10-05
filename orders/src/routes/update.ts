import express, { Request, Response } from "express";

const router = express.Router();

router.patch("/api/orders/:orderId", (req: Request, res: Response) => {
  res.send({});
});

export { router as updateOrderRouter };
