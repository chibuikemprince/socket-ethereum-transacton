import { Readable } from "stream";
import { Container, Service } from "typedi";

import { RpcConnectionController } from "./RpcController";
import { usdToWei } from "../helpers/misc";

@Service()
export class RPCFetcher {
  rpcConnectionController: RpcConnectionController;

  constructor() {
    this.rpcConnectionController = Container.get(RpcConnectionController);
  }
  async fetchLatestBlock(topic: string, socket: any, address: string = "") {
    console.log("fetching");
    const latestBlock = await this.rpcConnectionController.getLatestBlock();
    let previousBlockNumber: number = 0;

    let currentBlockNumber = 0;
    if (!latestBlock || latestBlock == null) {
      return;
    }
    const transactions = latestBlock.transactions.map((transact) => {
      currentBlockNumber = transact.blockNumber;

      if (currentBlockNumber === previousBlockNumber) {
        return null;
      }

      return {
        SenderAddress: transact.from,
        ReceiverAddress: transact.to,
        BlockNumber: transact.blockNumber,
        BlockHash: transact.blockHash,
        TransactionHash: transact.hash,
        GasPriceInWei: transact.gasPrice,
        ValueInWei: transact.value,
      };
    });
    previousBlockNumber = currentBlockNumber;

    const readableStream = new Readable({
      read() {},
    });

    var filteredTransactions: any[] = [];

    if (transactions[0] == null) {
      return;
    }

    filteredTransactions = transactions.filter((transaction) => {
      if (topic === "all") {
        return true; // All events
      } else if (topic === "senderOrReceiver") {
        return (
          transaction.SenderAddress == address ||
          transaction.ReceiverAddress == address
        ); // Events where address is either sender or receiver
      } else if (topic === "sender") {
        return transaction.SenderAddress == address; // Events where address is the sender
      } else if (topic === "receiver") {
        return transaction.ReceiverAddress; // Events where address is the receiver
      } else if (topic === "0-100-usd") {
        return (
          transaction.ValueInWei >= usdToWei(0) &&
          transaction.ValueInWei <= usdToWei(100)
        ); // Events within the range 0 - 100 usd
      } else if (topic === "100-500-usd") {
        return (
          transaction.ValueInWei > usdToWei(100) &&
          transaction.ValueInWei <= usdToWei(500)
        ); // Events within the range 100 - 500 usd
      } else if (topic === "500-2000-usd") {
        return (
          transaction.ValueInWei > usdToWei(500) &&
          transaction.ValueInWei <= usdToWei(2000)
        ); // Events within the range 500 - 2000 usd
      } else if (topic === "2000-5000-usd") {
        return (
          transaction.ValueInWei > usdToWei(2000) &&
          transaction.ValueInWei <= usdToWei(5000)
        ); // Events within the range 2000 - 5000 usd
      } else if (topic === ">5000-usd") {
        return transaction.ValueInWei > usdToWei(5000); // Events greater than 5000 usd
      }
      return false;
    });

    if (filteredTransactions.length == 0) {
      return;
    }
    // Split the latest block data into chunks and push them to the stream
    const blockDataString = JSON.stringify(transactions, (key, value) => {
      if (typeof value === "bigint") {
        return value.toString(); // Convert BigInt to string
      }
      return value; // Return non-BigInt values as is
    });
    const chunkSize = 1024; // Set the desired chunk size
    let offset = 0;
    while (offset < blockDataString.length) {
      const chunk = blockDataString.slice(offset, offset + chunkSize);
      readableStream.push(chunk);
      offset += chunkSize;
    }

    // Signal the end of the stream
    readableStream.push(null);

    let isStreamDone = false;

    readableStream.on("data", (chunk) => {
      // Emit the chunk to the client via the socket
      const chunkString = chunk.toString("utf8"); // Assuming utf-8 encoding

      //  io.to(topic).emit("blockchainEvent", {
      socket.emit("blockchainEvent", {
        message: "",
        data: chunkString,
        streamDone: false,
      });
    });

    readableStream.on("end", () => {
      isStreamDone = true;

      socket.emit("blockchainEvent", {
        message: "",
        data: "",
        streamDone: true,
      });
    });
  }
}
