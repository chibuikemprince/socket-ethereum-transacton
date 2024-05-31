import { io, Socket } from "socket.io-client";

const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTcxNzAyMDM0MSwiZXhwIjoxNzE3MTA2NzQxfQ.S-EHFldsb2fI9zwcb26EZYG2ascnDzqjBztD4PXJJc4"; // Replace with the actual authentication token

const socket: Socket = io("http://localhost:3000", {
  auth: {
    token: authToken,
  },
});

socket.on("connect", () => {
  console.log("Connected to the server");
});

var rev = "";
socket.on("blockchainEvent", (data: any) => {
  rev += data.data;
  if (data.streamDone) {
    let rev2 = JSON.parse(rev);
    console.log("\n \n \n \n Received message from server: ", rev2[0], rev2[1]);
    rev = "";
  }
});

const subscriptionParams = {
  //  topic: "0-100-usd",
  topic: "100-500-usd",
  //topic: "all",
}; // Replace with your desired room name
// const subscriptionParams = { topic: "all", address: "senderOrReceiver" }; // Replace with your desired room name
socket.emit("subscribe", subscriptionParams);

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});
