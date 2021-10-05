import request from "supertest";
import { app } from "../../app";

it("Return 400 when user didn't found", async () => {
  request(app)
    .post("/api/users/signin")
    .send({ email: "norbi1997@gmail.com", password: "norbika" })
    .expect(400);
});
it("Return 400 when email or password didn't match", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "Norbi1997@gmail.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "Norbi1997@gmail.com",
      password: "passwor",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "Norbi1997@gmail.co",
      password: "password",
    })
    .expect(400);
});

it("Return 200 on sucessfull sign in and return a cookie", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "Norbi1997@gmail.com",
      password: "password",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "Norbi1997@gmail.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
