import express from "express";
import ViteExpress from "vite-express";
import config from "../../config.json";
import createMQTTBroadcaster from "./createMQTTBroadcaster";

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

const server = ViteExpress.listen(app, config.port, () =>
  console.log("Server is listening on port", config.port)
);

createMQTTBroadcaster(
  `mqtt://${config.mqtt_broker}`,
  config.mqtt_topic,
  server
);
