import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY!) throw new Error("JWT KEY IS NOT DEFINED!!!");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI IS NOT DEFINED!!!");

  await mongoose
    .connect(process.env.MONGO_URI)
    .catch((error) => console.log(error));
  console.log("Connected to mongodb");
  app.listen(4000, () => {
    console.log("Listening on port 4000!!!");
  });
};
start();
