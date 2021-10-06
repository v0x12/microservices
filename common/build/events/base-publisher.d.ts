import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";
interface Event {
    Subject: Subjects;
    data: any;
}
export declare abstract class Publisher<T extends Event> {
    private client;
    protected abstract readonly subject: T["Subject"];
    constructor(client: Stan);
    publish(data: T["data"]): Promise<void>;
}
export {};
