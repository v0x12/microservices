import request from "supertest";
import { app } from "../../app";

it("Return 200 on sucessfully sign out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "Norbi1997@gmail.com",
      password: "password",
    })
    .expect(201);
  const response = await request(app).post("/api/users/signout").expect(200);
  expect(response.get("Set-Cookie")).toEqual([
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  ]);
});
