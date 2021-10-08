import { natsWrapper } from "./nats-wrapper";

const start = async () => {
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
};
start();