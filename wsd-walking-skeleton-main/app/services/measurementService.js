import { Client } from "https://deno.land/x/postgres@v0.14.3/mod.ts";

const client = new Client({
    hostname: "database-server",
    database: "database",
    user: "username",
    password: "password",
    port: Deno.env.PORT,
  });
  await client.queryObject("INSERT INTO names (name) VALUES ('Jenni');");

  await client.queryObject("INSERT INTO measurements (measurement) VALUES (6);");

const countAddresses = async() => {
  await client.connect();

  const result = await client.queryObject("SELECT COUNT(*) FROM measurements WHERE measurement < 1001 AND measurement >= 0;");
  await client.end();

  return result.rows[0].count;
};

const sumAddresses = async() => {
  await client.connect();
  const result = await client.queryObject("SELECT SUM(measurement) FROM measurements WHERE measurement < 1001 AND measurement >= 0;");
  await client.end();

  return result.rows[0].sum;
};

export {sumAddresses, countAddresses}