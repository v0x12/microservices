import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";
interface Event {
    Subject: Subjects;
    data: any;
}
export declare abstract class Listener<T extends Event> {
    protected abstract readonly subject: T["Subject"];
    protected abstract readonly queueGroupName: string;
    abstract onMessage(data: T["data"], msg: Message): void;
    protected ackWait: number;
    protected client: Stan;
    constructor(client: Stan);
    subscriptionOptions(): import("node-nats-streaming").SubscriptionOptions;
    listen(): void;
    parseMessage(msg: Message): any;
}
export {};
