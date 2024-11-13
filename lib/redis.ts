import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST, // Redis host, ensure it matches the one in RedisInsight
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined, // Redis port, default is 6379
  password: process.env.REDIS_PW,
  connectTimeout: 20000, // Redis password, if set in RedisInsight
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

export default redis;
