import http from "http";
import mqtt from "mqtt";
import { Server as SocketIOServer, Socket } from "socket.io";

export default function createMQTTBroadcaster(
  mqttBroker: string,
  mqttTopic: string,
  server: http.Server
) {
  const io = new SocketIOServer(server);
  const client = mqtt.connect(mqttBroker);

  // MQTT client connection
  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe(mqttTopic, (err) => {
      if (!err) {
        console.log("Subscribed to MQTT topic:", mqttTopic);
      }
    });
  });

  // MQTT message handler
  client.on("message", (_, message) => {
    // Broadcast MQTT message to all connected Socket.IO clients
    io.emit("mqttData", message.toString());
  });

  return { io, client };
}
