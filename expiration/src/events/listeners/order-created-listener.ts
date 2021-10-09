import {Listener, OrderCreatedEvent, OrderStatus, Subjects} from '@v0x-shared/common'
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  protected subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  protected queueGroupName: string = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const parseDate = JSON.parse(data.expiresAt)
    const expirationDate = new Date(parseDate).getMilliseconds()
    const currentDate = new Date().getMilliseconds()

    const expiredAt = expirationDate - currentDate;
    console.log("expiration:", expiredAt)
    await expirationQueue.add({orderId: data.id})

    msg.ack();
  }
}































