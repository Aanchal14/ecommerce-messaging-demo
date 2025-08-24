import { Kafka } from "kafkajs";

const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || "localhost:9092").split(",");
const KAFKA_TOPIC = "orders";

async function run() {
  const kafka = new Kafka({ brokers: KAFKA_BROKERS });
  const consumer = kafka.consumer({ groupId: "analytics" });

  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });

  console.log("📊 Analytics Service consuming orders...");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("📊 Analytics -> Order:", message.value.toString());
    },
  });
}

run().catch((err) => {
  console.error("analytics-service error:", err);
  process.exit(1);
});
