import { Subjects } from "../subjects";

export interface TicketCreatedEvent {
  Subject: Subjects.TICKET_CREATED;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
