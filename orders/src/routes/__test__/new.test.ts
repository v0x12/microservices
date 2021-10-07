import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

const createTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: "New title",
    price: 99,
  });
  await ticket.save();

  return ticket;
};

it("Returns 400 when invalid inputs are provided", async () => {
  const { cookie } = await global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: "",
    })
    .expect(400);
});

it("Return 404 when trying to reserve a ticket which is not found", async () => {
  const { cookie } = await global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: new mongoose.Types.ObjectId(),
    })
    .expect(404);
});

it("Returns 400 if ticket is already reserved", async () => {
  const ticket = await createTicket();
  const { cookie } = await global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("Returns 201 if the order was sucessfully created, and the ticket is reserved", async () => {
  const ticket = await createTicket();
  const { cookie } = await global.signin();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it("Emits an order created event!", async () => {
  const ticket = await createTicket();
  const { cookie } = await global.signin();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
