import amqp from "amqplib";

const ORDER_QUEUE = "orders";
const RABBIT_URL = process.env.RABBIT_URL || "amqp://localhost";

async function run() {
  const conn = await amqp.connect(RABBIT_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(ORDER_QUEUE, { durable: true });

  console.log("💳 Payment Service listening for orders...");
  channel.consume(ORDER_QUEUE, (msg) => {
    if (!msg) return;
    const order = JSON.parse(msg.content.toString());
    console.log("💳 Processing Payment for:", order);
    // simulate work
    setTimeout(() => channel.ack(msg), 300);
  }, { noAck: false });
}

run().catch((err) => {
  console.error("payment-service error:", err);
  process.exit(1);
});
