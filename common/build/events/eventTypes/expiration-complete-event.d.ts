import { Subjects } from "../subjects";
export interface ExpirationCompleteEvent {
    Subject: Subjects.EXPIRATION_COMPLETE;
    data: {
        orderId: string;
    };
}
