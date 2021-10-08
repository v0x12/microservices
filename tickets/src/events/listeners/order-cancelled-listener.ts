import { Listener, OrderCancelledEvent, Subjects } from "@v0x-shared/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  protected subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
  protected queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if(!ticket) throw new Error("Ticket not found!")

    ticket.set({
      orderId: undefined
    })

    await ticket.save()

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })

    msg.ack();
  }
}