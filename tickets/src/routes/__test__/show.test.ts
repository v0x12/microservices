import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("404 if ticket not found", async () => {
  await request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({})
    .expect(404);
});

it("200 when ticket is found", async () => {
  const { cookie, user } = await global.signin();

  const ticket = {
    title: "Some title",
    price: 99,
  };

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: ticket.title,
      price: ticket.price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId(response.body.id)}`)
    .send()
    .expect(200);

  const { title, price } = ticketResponse.body;

  expect(title).toEqual(ticket.title);
  expect(price).toEqual(ticket.price);
});
