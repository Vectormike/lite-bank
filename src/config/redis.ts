require("dotenv").config();

const redisConfig = {
  port: parseInt(process.env.REDIS_PORT, 10),
  host: process.env.REDIS_HOST,
  url: process.env.REDISCLOUD_URL,
  password: process.env.REDIS_PASSWORD,
};

export default redisConfig;