import { OrderCancelledEvent, Publisher, Subjects } from "@v0x-shared/common";
import { Message } from "node-nats-streaming";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  protected subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
}
