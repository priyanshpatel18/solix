import { redis } from "@/db/redis";
import { Queue } from "bullmq";

const REDIS_QUEUE_NAME = process.env.REDIS_QUEUE_NAME || "webhookQueue";

const webhookQueue = new Queue(REDIS_QUEUE_NAME, {
  connection: redis
});

export async function pushToQueue(data: any) {
  await webhookQueue.add("webhook-job", data);
}
