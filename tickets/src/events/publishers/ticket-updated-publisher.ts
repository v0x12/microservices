import { Publisher, Subjects, TicketUpdatedEvent } from "@v0x-shared/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  protected subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
}
