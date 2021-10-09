import { Subjects } from "../subjects";
export interface ExpirationComplete {
    Subject: Subjects.EXPIRATION_COMPLETE;
    data: {
        orderId: string;
    };
}
