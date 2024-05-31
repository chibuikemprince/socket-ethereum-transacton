import Web3 from "web3";
import { Service } from "typedi";

//
@Service()
export class RpcConnectionController {
  rpcEndpoints: string[] = [
    "https://eth.public-rpc.com",
    "https://cloudflare-eth.com",
    "https://data-seed-prebsc-1-s1.binance.org:8545",
    "https://data-seed-prebsc-2-s1.binance.org:8545",
    "https://data-seed-prebsc-1-s2.binance.org:8545",
    "https://data-seed-prebsc-2-s2.binance.org:8545",
  ];
  currentEndpointIndex: number;
  web3: Web3;

  constructor() {
    this.currentEndpointIndex = 0;
    this.web3 = new Web3(this.rpcEndpoints[this.currentEndpointIndex]);
  }

  switchToNextEndpoint() {
    this.currentEndpointIndex =
      (this.currentEndpointIndex + 1) % this.rpcEndpoints.length;
  }

  public getLatestBlockNumber = async () => {
    try {
      console.log({
        currentRPCURL: this.rpcEndpoints[this.currentEndpointIndex],
      });
      return await this.web3.eth.getBlockNumber();
    } catch (error) {
      console.log(error);
      this.switchToNextEndpoint();
      this.web3 = new Web3(this.rpcEndpoints[this.currentEndpointIndex]);
      return null;
    }
  };

  public getLatestBlock = async () => {
    try {
      console.log({
        currentRPCURL: this.rpcEndpoints[this.currentEndpointIndex],
      });
      const latestBlockNumber = await this.web3.eth.getBlockNumber();
      const latestBlock = await this.web3.eth.getBlock(latestBlockNumber, true);
      return latestBlock;
    } catch (error) {
      console.log(error);

      this.switchToNextEndpoint();
      this.web3 = new Web3(this.rpcEndpoints[this.currentEndpointIndex]);
      return null;
    }
  };
}

//export const rpcConnectionController = new RpcConnectionController();
