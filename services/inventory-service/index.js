import { Kafka } from "kafkajs";

const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || "localhost:9092").split(",");
const KAFKA_TOPIC = "orders";

async function run() {
  const kafka = new Kafka({ brokers: KAFKA_BROKERS });
  const consumer = kafka.consumer({ groupId: "inventory" });

  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });

  let total = 0;
  console.log("📦 Inventory Service consuming orders...");
  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      total += order.qty || 1;
      console.log(`📦 Inventory reserved for order ${order.id}. Total reserved: ${total}`);
    },
  });
}

run().catch((err) => {
  console.error("inventory-service error:", err);
  process.exit(1);
});
