import { Publisher, Subjects, TicketCreatedEvent } from "@v0x-shared/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  protected subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}
