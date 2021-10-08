import { Listener, OrderCreatedEvent, Subjects } from "@v0x-shared/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  protected subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  protected queueGroupName: string = 'tickets-service';
  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    // Finding the ticket for resrving the order
    const ticket = await Ticket.findById(data.ticket.id)
    // If ticket not found return an error
    if(!ticket) {
      throw new Error('Ticket not found!')
    }
    // Set the ticket order value for reserve
    ticket?.set({
      orderId: data.id
    })
    // Save the ticket
    await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: data.id,
      version: ticket.version
    })
    // Ack's the message
    msg.ack();
  }
}