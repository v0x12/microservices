import { natsWrapper } from "../../../nats-wrapper"
import mongoose from 'mongoose'
import { TicketCreatedListener } from "../ticket-created-listener"
import {TicketCreatedEvent} from '@v0x-shared/common'
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/Ticket"

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)
  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toString(),
    title: "New title",
    price: 99,
    userId: "Some id",
    version: 0
  }
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn().mockImplementation((): void => {})
  }

  return {data, msg, listener}
}


it("Creates and saves a ticket", async () => {
  const {data, msg, listener} = await setup()
  // Call the onmessage function with the data object + message object
  await listener.onMessage(data, msg)
  //  Write assertions for make sure the ticket was created
  const ticket = await Ticket.findById(data.id);
  
  expect(ticket).not.toBeNull();
  expect(ticket!.title).toEqual(data.title)
})

it("acks the message", async () => {
  const {data, msg, listener} = await setup()
  // Call the onmessage function with the data object + message object
  await listener.onMessage(data, msg)
  // Write assertions to make sure the fake ack message was called
  expect(msg.ack).toHaveBeenCalled()
})