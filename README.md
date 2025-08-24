# ecommerce-messaging-demo

A minimal demo showing **when to use Kafka vs RabbitMQ** in an e‑commerce context.

## Services
- **order-service**: Produces orders to **RabbitMQ** (work queue) and **Kafka** (event stream).
- **payment-service**: Consumes **RabbitMQ** orders and simulates payment processing.
- **inventory-service**: Consumes **Kafka** orders to update inventory projections.
- **notification-service**: Consumes **RabbitMQ** orders to simulate user notifications.
- **analytics-service**: Consumes **Kafka** orders for analytics/logging.

## Prereqs
- Docker + Docker Compose
- Node.js 18+

## Quick start

```bash
# 1) Start infra
docker-compose up -d

# 2) Install deps per service
cd services/order-service && npm install && cd ..
cd payment-service && npm install && cd ..
cd inventory-service && npm install && cd ..
cd notification-service && npm install && cd ..
cd analytics-service && npm install && cd ../..

# 3) Run services (each in its own terminal)
node services/order-service/index.js
node services/payment-service/index.js
node services/inventory-service/index.js
node services/notification-service/index.js
node services/analytics-service/index.js
```

### Verification
You should see:
- `order-service` printing `📦 New Order` every 5 seconds.
- `payment-service` and `notification-service` handling the **RabbitMQ** order task.
- `inventory-service` and `analytics-service` handling the **Kafka** stream (with replay from beginning).

### RabbitMQ UI
Open http://localhost:15672 (user: `guest`, password: `guest`)

### Notes
- Kafka topics are auto-created (`orders`) via `KAFKA_AUTO_CREATE_TOPICS_ENABLE=true`.
- This demo uses Zookeeper-backed Kafka for simplicity; feel free to swap to KRaft in production.
- Each service is intentionally tiny to focus on **role fit**: RabbitMQ for **work queues**, Kafka for **event streams**.
