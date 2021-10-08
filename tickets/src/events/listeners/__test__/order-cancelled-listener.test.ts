import { OrderCancelledEvent } from '@v0x-shared/common';
import mongoose from 'mongoose'
import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const {cookie, user} = await global.signin();
  const orderId = new mongoose.Types.ObjectId().toString();
  const ticket = Ticket.build({
    title: "New title",
    price: 90,
    userId: user.id,
  })
  ticket.orderId = orderId
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    ticket: {
      id: ticket.id
    },
    version: 0
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn().mockImplementation((): void => {})
  }


  return {ticket, listener, msg, data}
}

it("Cancel an order", async () => {
  const {ticket, listener, msg, data} = await setup();

  const currentTicketState = await Ticket.findById(data.ticket.id)
  expect(currentTicketState?.orderId).toBeDefined()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(data.ticket.id)
  expect(updatedTicket?.orderId).toBeUndefined()

})

it("Ack's the message", async() => {
  const {ticket, listener, msg, data} = await setup();

  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it("Publishes an ticket updated event", async () => {
  const {ticket, listener, msg, data} = await setup();

  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled();  

  console.log((natsWrapper.client.publish as jest.Mock).mock.calls)
})