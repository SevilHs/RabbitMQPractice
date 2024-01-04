const amqp = require("amqplib");
const data = require("./data.json");

const queueName = process.argv[2] || "jobsQueue";

connect_rabbitmq();

async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    // Get message

    console.log("Waiting for message...");

    channel.consume(queueName, (message) => {
      const messageInfo = JSON.parse(message.content.toString());
      const userInfo = data.find((user) => user.id == messageInfo.description);
      if (userInfo) {
        console.log("User info", userInfo);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log("Error message", error);
  }
}
