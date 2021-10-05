import request from "supertest";
import { app } from "../../app";

const createTicket = async () => {
  const { cookie } = await global.signin();

  const ticket = {
    title: "Some title",
    price: 99,
  };

  await request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: ticket.title,
    price: ticket.price,
  });
};

it("It return all of tickets", async () => {
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send({}).expect(200);

  const { tickets } = response.body;

  expect(tickets.length).toEqual(2);
});
