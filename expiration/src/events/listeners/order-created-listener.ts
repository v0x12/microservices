import {Listener, OrderCreatedEvent, OrderStatus, Subjects} from '@v0x-shared/common'
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  protected subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  protected queueGroupName: string = queueGroupName;
  onMessage(data: { id: string; userId: string; status: OrderStatus; expiresAt: string; ticket: { id: string; price: number; }; version: number; }, msg: Message): void {
   console.log("Hello") 
  }
}