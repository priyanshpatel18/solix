import Bull from "bull";

const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;
const REDIS_QUEUE_NAME = process.env.REDIS_QUEUE_NAME || "webhookQueue";

const webhookQueue = new Bull(REDIS_QUEUE_NAME, {
  redis: {
    host: REDIS_URL,
    password: REDIS_TOKEN,
    tls: {},
  },
});

export default async function pushToQueue(data: any) {
  await webhookQueue.add(data);
}