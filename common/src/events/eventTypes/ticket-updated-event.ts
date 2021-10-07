import { Subjects } from "../subjects";

export interface TicketUpdatedEvent {
  Subject: Subjects.TICKET_UPDATED;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    orderId: string;
    version: number;
  };
}
