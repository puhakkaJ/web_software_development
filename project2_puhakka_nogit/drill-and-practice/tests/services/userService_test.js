import { superoak } from "../../deps.js";
import * as userService from "../../services/userService.js";
import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";
import { app } from "../../app.js";


Deno.test({
  name:
    "POST request to /auth/register with passworld length 3 should not add a user",
  async fn() {
    await userService.deleteUser("some.user@hotmail.com");
    const testClient = await superoak(app);
    await testClient.post("/auth/register").send({
      email: "some.user@hotmail.com",
      password: "hei",
    });
    const query = await userService.findUserByEmail("some.user@hotmail.com");
    assertEquals(query.length, 0);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "POST request to /auth/register with not valid email should not add a user",
  async fn() {
    await userService.deleteUser("not email");
    const testClient = await superoak(app);
    await testClient.post("/auth/register").send({
      email: "not email",
      password: "password",
    });
    const query = await userService.findUserByEmail("not email");
    assertEquals(query.length, 0);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});


Deno.test({
  name: "POST request to /auth/register with validated parameters should add a user",
  async fn() {
    await userService.deleteUser("some.user@hotmail.com");
    const testClient = await superoak(app);
    await testClient.post("/auth/register").send(
      "email=some.user@hotmail.com&password=password",
    ).expect(
      302,
    );
    const query = await userService.findUserByEmail("some.user@hotmail.com");
    console.log(query);
    assertEquals(query.length, 1);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Registered user should not be able to login with correct credentials",
  async fn() {
    const testClient = await superoak(app);
    const response = await testClient.post("/auth/login").send(
      "email=some.user@hotmail.com&password=not_correct",
    )
    console.log(response.headers);
    const url = response.headers["location"];
    assertEquals(url, undefined);
    
  },
  
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Registered user should be able to login with correct credentials and redirected to /topics page",
  async fn() {
    const testClient = await superoak(app);
    const response = await testClient.post("/auth/login").send(
      "email=some.user@hotmail.com&password=password",
    );

    console.log(response.headers);
    const url = response.headers["location"];
    assertEquals(url, "/topics");
   
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "User can not access /quiz page and is redirected",
  async fn() {
    await userService.deleteUser("some.user@hotmail.com");
    const testClient = await superoak(app);
    await testClient.get("/quiz").expect(
      302,
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "User can not access /topics page and is redirected",
  async fn() {
    await userService.deleteUser("some.user@hotmail.com");
    const testClient = await superoak(app);
    await testClient.get("/topics").expect(
      302,
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "POST request to root / should return status 200 OK",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
