import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "New title",
    price: 99,
  });
  await ticket.save();

  return ticket;
};

it("Return 401 when the user in not authorized", async () => {
  await request(app).get("/api/orders").send({}).expect(401);
});

it("Return 404 when no orders found for the authenticated user", async () => {
  const { cookie } = await global.signin();
  const ticket = await createTicket();

  await request(app)
    .get("/api/orders")
    .set("Cookie", cookie)
    .send()
    .expect(404);
});

it("Return 200 when successfully found all the orders for the related user", async () => {
  const { cookie: cookie1, user: user1 } = await global.signin();
  const { cookie: cookie2, user: user2 } = await global.signin(
    new mongoose.Types.ObjectId().toString(),
    "CustomEmail@gmail.com"
  );
  const ticket = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();

  await request(app).post("/api/orders").set("Cookie", cookie1).send({
    ticketId: ticket.id,
  });

  await request(app).post("/api/orders").set("Cookie", cookie1).send({
    ticketId: ticket3.id,
  });

  await request(app).post("/api/orders").set("Cookie", cookie2).send({
    ticketId: ticket2.id,
  });

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", cookie1)
    .send()
    .expect(200);

  const responseNext = await request(app)
    .get("/api/orders")
    .set("Cookie", cookie2)
    .send()
    .expect(200);

  const responseOrder = response.body.find(
    (x: any) => x.ticket.id === ticket.id
  );

  const responseOrder2 = responseNext.body.find(
    (x: any) => x.ticket.id === ticket2.id
  );

  expect(response.body.length).toEqual(2);
  expect(responseOrder.ticket).toBeDefined();
  expect(responseOrder.ticket.id).toEqual(ticket.id);
  expect(responseOrder.ticket.id).not.toEqual(responseOrder2.ticket.id);
  expect(responseOrder.userId).toEqual(user1.id);
  expect(responseOrder.userId).not.toEqual(user2.id);
  expect(responseOrder2.userId).toEqual(user2.id);
  expect(responseOrder2.userId).not.toEqual(user1.id);
  expect(responseOrder2.ticket).toBeDefined();
  expect(responseOrder2.ticket.id).toEqual(ticket2.id);
});
