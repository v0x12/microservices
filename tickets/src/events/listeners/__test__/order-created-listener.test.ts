import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from "@v0x-shared/common";
import { Ticket } from "../../../models/Ticket"
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { TicketUpdatedPublisher } from '../../publishers/ticket-updated-publisher';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const {cookie, user} = await global.signin();

  const ticket = Ticket.build({
    title: "New title",
    price: 90,
    userId: user.id
  })

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toString(),
    userId: user.id,
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    },
    version: 0
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn().mockImplementation((): void => {})
  }


  return {ticket, listener, msg, data}
}

it("Reserve a ticket", async () => {
  const {listener, msg, data} = await setup();

  await listener.onMessage(data, msg);

  const reservedTicket = await Ticket.findById(data.ticket.id);
  expect(reservedTicket?.orderId).toBeDefined();
})

it("Acks a message", async () => {
  const {listener, msg, data} = await setup();

  await listener.onMessage(data, msg);
  
  expect(msg.ack).toHaveBeenCalled();
})

it("Publishes a ticket updated event", async () => {
  const {listener, msg, data} = await setup();

  await listener.onMessage(data, msg);
  
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(data.id).toEqual(ticketUpdatedData.orderId)
})