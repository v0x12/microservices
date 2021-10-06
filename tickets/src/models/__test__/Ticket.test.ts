import { Ticket } from "../Ticket";
import request from 'supertest'
import {app} from '../../app'

it("Implements an optimistic concurrency control" , async () => {
  const {cookie, user} = await global.signin()

  const ticket = Ticket.build({
    title: "New title",
    price: 99,
    userId: user.id,
  })

  await ticket.save().catch(err => null)

  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  firstInstance!.set({
    title: "changed"
  })

  secondInstance!.set({
    price: 50
  })

  await firstInstance!.save();
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach this point!")
})

it("Increments the version number on multiple saves", async () => {
  const {cookie, user} = await global.signin()


  const ticket = Ticket.build({
    title: "New title",
    price: 99,
    userId: user.id,
  })

  await ticket.save();
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2)
})