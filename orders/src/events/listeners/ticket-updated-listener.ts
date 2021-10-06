import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@v0x-shared/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  protected subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
  protected queueGroupName: string = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    const {id, title, price} = data
    
    const ticket = await Ticket.findById(id)

    if (!ticket) throw new NotFoundError("Ticket not found")

    ticket.set({
      title, price
    })
    await ticket.save()

    msg.ack()
  }
}