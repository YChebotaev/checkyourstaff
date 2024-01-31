import { Redis } from "ioredis";

export const redisConnection = new Redis({
  port: 6379,
  host: "localhost",
  password: process.env["REDIS_PASSWORD"],
});
