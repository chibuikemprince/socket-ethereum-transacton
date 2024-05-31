import { CustomSocket } from "../types";
import { Container } from "typedi";
import { RPCFetcher } from "../services/FetchRpcData";
const rPCFetcher = Container.get(RPCFetcher);

export const connectionHandler = (socket: CustomSocket) => {
  console.log("Connected");

  socket.on("subscribe", async (subscriptionParams: any) => {
    const { topic, address } = subscriptionParams;
    console.log(`subscribing to ${topic}`);

    await rPCFetcher.fetchLatestBlock(topic, socket, address);

    // Set an interval to call the fetchLatestBlock function every 12 seconds

    const interval = setInterval(() => {
      rPCFetcher.fetchLatestBlock(topic, socket, address);
    }, 12000);

    // Stop the interval and emit the streamDone event when needed

    const stopStreaming = () => {
      clearInterval(interval);
      socket.emit("blockchainEvent", {
        message: "",
        data: "",
        streamDone: true,
      });
    };
    socket.on("disconnect", stopStreaming);
  });

  // Error handling for the socket
  socket.on("error", (error) => {
    console.error("An error occurred on the socket:", error);
    // Emit the error event to the client
    socket.emit("socketError", { message: error.message });
  });
};
