import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import mongoose from "mongoose";

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "New title",
    price: 99,
  });
  await ticket.save();

  return ticket;
};

it("200 on successfully fetch the order", async () => {
  const { cookie, user } = await global.signin();
  const ticket = await createTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const { body: orderResponse } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(orderResponse.id).toEqual(order.id);
  expect(orderResponse.userId).toEqual(user.id);
});

it("401 when user trying to fetch other user order", async () => {
  const { cookie, user } = await global.signin();
  const { cookie: cookieTwo, user: userTwo } = await global.signin(
    new mongoose.Types.ObjectId().toString(),
    "CustomEmail@gmail.com"
  );

  const ticket = await createTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const { body: orderResponse } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  const { body: failOrderResponse } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookieTwo)
    .send()
    .expect(401);

  expect(orderResponse.id).toEqual(order.id);
  expect(orderResponse.userId).toEqual(user.id);
});
