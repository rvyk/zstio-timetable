import { createClient } from "redis";

let db: ReturnType<typeof createClient> | null = null;

if (process.env.REDIS_URL) {
  db = await createClient({
    url: process.env.REDIS_URL,
  })
    .on("error", (err) => console.error("Redis Client Error", err))
    .connect();
}

export const isRedisConnected = async () => {
  if (!db) return false;

  try {
    await db.ping();
    return true;
  } catch (error) {
    console.error("Redis connection check failed:", error);
    return false;
  }
};

export default db;
