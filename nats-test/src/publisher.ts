import nats from "node-nats-streaming";
import { TicketCreatedEvent } from "./events/ticket-created-event";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const ticket: TicketCreatedEvent["data"] = {
    id: "asd",
    title: "asd",
    price: 99,
    userId: "asd",
  };

  const publisher = new TicketCreatedPublisher(stan);

  await publisher.publish(ticket).catch((err) => console.log(err));
});
