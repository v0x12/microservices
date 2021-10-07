import { Order, OrderStatus } from "./../../models/Order";
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

it("Return 204 on when sucessfully cancelled the order", async () => {
  const ticket = await createTicket();
  const { cookie, user } = await global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Return 401 when trying to cancel somebody else order", async () => {
  const ticket = await createTicket();
  const { cookie, user } = await global.signin();
  const { cookie: cookieTwo, user: userTwo } = await global.signin(
    new mongoose.Types.ObjectId().toString(),
    "CustomEmail@gmail.com"
  );

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookieTwo)
    .send()
    .expect(401);
});

it("It emits an event cancelled event", async () => {
  const ticket = await createTicket();
  const { cookie, user } = await global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
