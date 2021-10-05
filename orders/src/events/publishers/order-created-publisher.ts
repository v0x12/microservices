import { OrderCreatedEvent, Publisher, Subjects } from "@v0x-shared/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  protected subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
}
