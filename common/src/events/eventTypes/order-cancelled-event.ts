import { OrderStatus } from "../order-status";
import { Subjects } from "../subjects";

export interface OrderCancelledEvent {
  Subject: Subjects.ORDER_CANCELLED;
  data: {
    id: string;
    ticket: {
      id: string;
    };
    version: number;
  };
}
