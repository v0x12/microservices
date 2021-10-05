import request from "supertest";
import { app } from "../../app";

it("Returns a 201 on successfull signup!", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "Norbi1997@gmail.com",
      password: "password",
    })
    .expect(201);
});

it("Return 400 on invalid email input", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "Norbi1997gmail.com",
      password: "password",
    })
    .expect(400);
});

it("Return 400 when the password is less than 8 character", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "Norbi1997@gmail.com",
      password: "paord",
    })
    .expect(400);
});

it("Return 400 when the password or email is missing", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "asdasdas@gmaik.com",
      password: "",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "sdsaddasdasdsa",
    })
    .expect(400);
});

it("Return 400 on email duplication", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "asdasdas@gmaik.com",
      password: "asdasdsadas",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "asdasdas@gmaik.com",
      password: "asdasdsadas",
    })
    .expect(400);
});

it("Sets a cookie after successfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "Norbi1997@gmail.com",
      password: "password",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
