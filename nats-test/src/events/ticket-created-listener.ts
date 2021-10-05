import { Message, Stan } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  protected readonly subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
  protected readonly queueGroupName: string = "ticket-queue";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log(data.id, data.title, data.price);
    msg.ack();
  }
}
