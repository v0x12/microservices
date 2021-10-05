import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import { natsWrapper } from "../../nats-wrapper";

it("/api/tickets listening for a post request", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("accessed the route when user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("not returning 401 when user is signed in", async () => {
  const { cookie, user } = await global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it("It returns an error if an invalid title is provided", async () => {
  const { cookie } = await global.signin();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
});

it("return an error if an invalid price is provided", async () => {
  const { cookie } = await global.signin();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Some title",
      price: -10,
    })
    .expect(400);
});

it("Creates a new ticket with valid inputs provided", async () => {
  const { cookie, user } = await global.signin();

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

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

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

  const { title: responseTitle, price: responsePrice } = response.body;
  expect(responseTitle).toEqual(ticket.title);
  expect(responsePrice).toEqual(ticket.price);
});

it("publishes an event", async () => {
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

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
