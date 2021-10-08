import mongoose from "mongoose";
import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY!) throw new Error("JWT KEY IS NOT DEFINED!!!");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI IS NOT DEFINED!!!");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID IS NOT DEFINED!!!");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID IS NOT DEFINED!!!");
  if (!process.env.NATS_URL) throw new Error("NATS_URL IS NOT DEFINED!!!");

  await natsWrapper.connect({
    clusterIp: process.env.NATS_CLUSTER_ID,
    clientId: process.env.NATS_CLIENT_ID,
    url: process.env.NATS_URL,
  });

  natsWrapper.client.on("close", () => {
    console.log("Nats connection closed!");
    process.exit();
  });
  process.on("SIGINT", () => natsWrapper.client.close());
  process.on("SIGTERM", () => natsWrapper.client.close());

  new OrderCreatedListener(natsWrapper.client).listen()
  new OrderCancelledListener(natsWrapper.client).listen()

  await mongoose
    .connect(process.env.MONGO_URI)
    .catch((error) => console.log(error));

  console.log("Connected to mongodb");

  app.listen(4000, () => {
    console.log("Listening on port 4000!!!");
  });
};
start();
