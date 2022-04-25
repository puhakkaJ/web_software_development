import { superoak } from "../../deps.js";
import { app } from "../../app.js";


Deno.test({
    name: "GET request to /api/questions/random should be accessible (status 200 OK)",
    async fn() {
      const testClient = await superoak(app);
      await testClient.get("/api/questions/random").expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});
  
Deno.test({
    name: "GET request to /api/questions/random should send random json data",
    async fn() {
      const testClient = await superoak(app);
      await testClient.get("/api/questions/random")
        .expect(200)
        .expect("Content-Type", new RegExp("application/json"));
    },
    sanitizeResources: false,
    sanitizeOps: false,
});