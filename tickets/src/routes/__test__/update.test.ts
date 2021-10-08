import { natsWrapper } from "../../nats-wrapper";
import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/Ticket";

const createTicket = (cookie?: string[], title?: string, price?: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie || [])
    .send({
      title: title || "Default Title",
      price: price || 99,
    });
};

it("401 if user not authenticated", async () => {
  await request(app).put("/api/tickets/asdadssadasdsa").send({}).expect(401);
});

it("404 if the id does not exist", async () => {
  const { cookie } = await global.signin();

  await createTicket(cookie, "Some title", 99.99);

  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({
      title: "Some title",
      price: 99.99,
    })
    .set("Cookie", cookie)
    .expect(404);
});

it("401-403 if the user does not own the ticket", async () => {
  const { cookie: cookieOne } = await global.signin();
  const { cookie: cookieTwo } = await global.signin("New id");

  const response = await createTicket(cookieOne, "Some Title", 99).expect(201);
  const { id } = response.body;

  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId(id)}`)
    .set("Cookie", cookieTwo)
    .send({ title: "Valid title", price: 12 })
    .expect(401);
});

it("400 when invalid inputs are provided for update", async () => {
  const { cookie } = await global.signin();

  await request(app)
    .put("/api/tickets/sdjadjsalkdjkla")
    .send({
      title: "",
      price: 99,
    })
    .set("Cookie", cookie)
    .expect(400);
});

it("200 and sucessfully update an ticket", async () => {
  const { cookie } = await global.signin();
  const response = await createTicket(cookie, "Valid title", 99).expect(201);
  const { id, title, price } = response.body;

  const updateResponse = await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId(id)}`)
    .set("Cookie", cookie)
    .send({
      title: "Updated Title",
      price: 10,
    });

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  expect(updateResponse.body.title).not.toEqual(title);
  expect(updateResponse.body.price).not.toEqual(price);
});

it("Rejects an update if the ticket is reserved.", async () => {
  const { cookie } = await global.signin();
  const response = await createTicket(cookie, "Valid title", 99).expect(201);
  const { id, title, price } = response.body;

  const ticket = await Ticket.findById(id)

  ticket!.orderId = new mongoose.Types.ObjectId().toString()
  await ticket!.save()

  const updateResponse = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({ title: "New Valid title", price: 12 })
    .expect(400);
})
