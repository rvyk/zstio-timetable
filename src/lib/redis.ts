import { createClient } from "redis";

const db = await createClient({
  url: process.env.REDIS_URL,
})
  .on("error", (err) => console.error("Redis Client Error", err))
  .connect();

export default db;
