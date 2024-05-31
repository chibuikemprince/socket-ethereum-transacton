import { RpcConnectionController } from "../services/RpcController";
console.log = jest.fn();

describe("RpcConnectionController", () => {
  let rpcConnectionController: RpcConnectionController;

  beforeEach(() => {
    rpcConnectionController = new RpcConnectionController();
    rpcConnectionController.web3.eth.getBlockNumber = jest.fn();
    rpcConnectionController.web3.eth.getBlock = jest.fn();
    rpcConnectionController.switchToNextEndpoint = jest.fn(() => {
      rpcConnectionController.currentEndpointIndex++;
    });
  });

  describe("getLatestBlockNumber", () => {
    it("should return the latest ethereum block number", async () => {
      const mockBlockNumber = 100;
      rpcConnectionController.web3.eth.getBlockNumber = jest
        .fn()
        .mockResolvedValue(mockBlockNumber);

      const result = await rpcConnectionController.getLatestBlockNumber();
      expect(result).toBe(mockBlockNumber);
      expect(
        rpcConnectionController.web3.eth.getBlockNumber
      ).toHaveBeenCalled();
    });
  });

  describe("getLatestBlock", () => {
    it("should return the latest ethereum block", async () => {
      const mockBlockNumber = 100;
      const mockBlock = { number: mockBlockNumber };
      rpcConnectionController.web3.eth.getBlockNumber = jest
        .fn()
        .mockResolvedValue(mockBlockNumber);

      rpcConnectionController.web3.eth.getBlock = jest
        .fn()
        .mockResolvedValue(mockBlock);

      const result = await rpcConnectionController.getLatestBlock();
      expect(result).toBe(mockBlock);

      // rpcConnectionController.web3.eth.getBlockNumber = jest.fn();

      expect(
        rpcConnectionController.web3.eth.getBlockNumber
      ).toHaveBeenCalled();

      // rpcConnectionController.web3.eth.getBlock = jest.fn();
      expect(rpcConnectionController.web3.eth.getBlock).toHaveBeenCalledWith(
        mockBlockNumber,
        true
      );
    });

    it("should switch to the next RPC endpoint if an error occurs", async () => {
      const mockError = new Error("Error occurred");

      rpcConnectionController.web3.eth.getBlockNumber = jest.fn(() => {
        throw new Error("Error occurred");
      });
      ///.mockRejectedValue(mockError);

      const currentEndpointIndex = rpcConnectionController.currentEndpointIndex;

      const result = await rpcConnectionController.getLatestBlock();
      expect(result).toBe(null);

      expect(rpcConnectionController.switchToNextEndpoint).toHaveBeenCalled();

      expect(rpcConnectionController.web3.eth.getBlockNumber).toThrow();

      expect(rpcConnectionController.currentEndpointIndex).toBe(
        (currentEndpointIndex + 1) % rpcConnectionController.rpcEndpoints.length
      );
    });
  });
});
