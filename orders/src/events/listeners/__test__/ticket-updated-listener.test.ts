import mongoose from 'mongoose'
import { TicketUpdatedEvent } from "@v0x-shared/common"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/Ticket'

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: "New title",
    price: 99,
  })

  await ticket.save();
  // Create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: "Updated title",
    price: 99,
    userId: "Some id",
    version: 1
  }
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn().mockImplementation((): void => {})
  }

  return {data, msg, listener, ticket}
}

it("Event is successfully updating an ticket", async () => {
  const {data, msg, listener, ticket} = await setup()
 
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);


  expect(updatedTicket?.title).toEqual("Updated title")
})

it("If event processed check version number is updated for the ticket", async () => {
  const {data, msg, listener, ticket} = await setup()
 
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);


  expect(updatedTicket?.title).toEqual("Updated title")
  expect(updatedTicket?.version).toEqual(1)
})

it("Return error on version conflict", async () => {
  const {data, msg, listener, ticket} = await setup()
 
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket?.version).toEqual(1)

  // Return error on version conflict
  await listener.onMessage(data, msg).catch(err => null)
})

it("Acks the message on sucessfuly processed event", async () => {
  const {data, msg, listener, ticket} = await setup()
 
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket?.version).toEqual(1)
  expect(msg.ack).toHaveBeenCalled();
})