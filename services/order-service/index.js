import amqp from "amqplib";
import { Kafka } from "kafkajs";

const ORDER_QUEUE = "orders";
const RABBIT_URL = process.env.RABBIT_URL || "amqp://localhost";
const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || "localhost:9092").split(",");
const KAFKA_TOPIC = "orders";

async function run() {
  // RabbitMQ Producer
  const rabbitConn = await amqp.connect(RABBIT_URL);
  const channel = await rabbitConn.createChannel();
  await channel.assertQueue(ORDER_QUEUE, { durable: true });

  // Kafka Producer
  const kafka = new Kafka({ brokers: KAFKA_BROKERS });
  const producer = kafka.producer();
  await producer.connect();

  let i = 0;
  setInterval(async () => {
    i += 1;
    const order = { id: Date.now(), seq: i, item: "Laptop", qty: 1, price: 1200 };
    const body = JSON.stringify(order);
    console.log("📦 New Order:", order);

    // Send to RabbitMQ (task queue)
    channel.sendToQueue(ORDER_QUEUE, Buffer.from(body), { persistent: true });

    // Send to Kafka (event stream)
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [{ key: String(order.id), value: body }],
    });
  }, 5000);
}

run().catch((err) => {
  console.error("order-service error:", err);
  process.exit(1);
});
