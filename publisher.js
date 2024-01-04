const amqp = require("amqplib");
const data = require("./data.json");

const message = {
  description: "This is a test message",
};

const queueName = process.argv[2] || "jobsQueue";

connect_rabbitmq();

async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    data.forEach((item) => {
      message.description = item.id;
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log("Sended message", item.id);
    });

    /* ---------------------------------------INTERVAL-----------------------------------------------
    setInterval(() => {
      message.description = new Date().getTime();
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log("Sended message", message);
    }, 1);  
    ------------------------------------------INTERVAL-----------------------------------------------*/
  } catch (error) {
    console.log("Error message", error);
  }
}
