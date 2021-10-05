import request from "supertest";
import { app } from "../../app";

it("Return the currently logged in user", async () => {
  const cookie = await signin();

  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  console.log(res.body);
  expect(res.body.currentUser).not.toBeNull();
  expect(res.body.currentUser.email).toEqual("Norbi1997@gmail.com");
});

it("Responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
