# README

This project is about setting up socket.io and building a realtime
endpoint with it. Ethereum is only a datasource than can be swapped for
anything in the future.

Below are instructions on how to set up and run the code locally, along with relevant documentation to help understand the solution better.

## Setup and Run

### Prerequisites

- Ensure that Docker and Docker Compose are installed on your machine.

### Installation

1. Clone the repository to your local machine.
2. Open a terminal and navigate to the project directory.

### Running the Application

1.  Run `docker-compose up --build` to start the defined services.
2.  The application should be accessible on `http://localhost:3000`

## Design Choices and Assumptions

### Code 1: Socket Connection Handler

The socket connection handler code leverages the `RPCFetcher` service to fetch the latest block data and emit events to connected sockets. It uses an interval-based approach to periodically update the data every 12 seconds. The code assumes that the `RPCFetcher` service is correctly implemented and that the necessary event handling functions are defined in the application.

The `RpcConnectionController` service provides functionality for managing RPC endpoints and fetching the latest block data from Ethereum. It includes methods for switching to the next endpoint, getting the latest block number, and retrieving the latest block. The service utilizes the web3 library for interacting with Ethereum nodes and handles endpoint switching in case of errors, since public Ethereum RPC endpoints may be down from time to time or you may
run out of free API calls (300 requests/min).

### HTTP Request Authentication Middleware

The HTTP request authentication middleware code provides user registration and login via `UserController` service, token verification and authentication for incoming requests.

### TypeORM and TypeDI

The code utilizes TypeORM and TypeDI for database management and dependency injection, respectively. These libraries were chosen for their robustness, ease of use, and community support. TypeORM provides an ORM (Object-Relational Mapping) to simplify database interactions, while TypeDI offers a powerful dependency injection container for managing dependencies in a modular and maintainable manner.

### Streaming Data to Clients

The decision to stream data to clients instead of sending it all at once was made to handle large data sets efficiently. This approach prevents memory issues that could arise when sending large amounts of data in a single response. Clients are expected to receive the streamed response and save it in a temporary store until the end of each stream. The response can then be converted to a JavaScript object using `JSON.parse()`. The end of the stream is defined when the `streamDone` property of the streamed data is `true`.

## Sample Client Implementation

For a sample client implementation, refer to the `/src/clients/1.ts` file. It demonstrates how to receive and handle the streamed response by saving it in a temporary store until the stream is complete.

## Running E2E Jest Tests

To run the Jest tests for the provided application, follow the instructions below:

### Prerequisites

- Node.js and npm should be installed on your machine.

### Running Jest Tests

Since the application has been dockerized, if you wish to run the tests, it would be on your local machine. Follow the steps below to run the Jest tests:

1. Open a terminal and navigate to the root directory of the application.
2. Run the following command to install the necessary dependencies:
   ```bash
   `npm install`
   ```
3. Once the dependencies are installed, you can run the Jest tests using the following command:
   ```bash
   `npm run test`
   ```
   This command will start the Jest test runner and execute the tests for the application.

Please note that the tests should be run on your local machine, as the application has been dockerized. If you wish to run the tests on the dockerized application, you will need to run the command `npm run test` on the docker container

## File Structure

src  
├─ clients  
│ └─ 1.ts  
├─ entity  
│ └─ User.ts  
├─ helpers  
│ └─ misc.ts  
├─ middlewares  
│ ├─ authMiddleware.ts  
│ ├─ socketHandler.ts  
│ └─ tokenVerifiy.ts  
├─ migration  
├─ public  
│ └─ index.html  
├─ services  
│ ├─ AuthController.ts  
│ ├─ FetchRpcData.ts  
│ ├─ RpcController.ts  
│ └─ UserController.ts  
├─ test  
│ ├─ RpcController.test.ts  
│ └─ UserController.test.ts  
├─ data-source.ts  
├─ index.ts  
├─ routes.ts  
└─ types.d.ts

.dockerignore

.env

.gitignore

docker-compose.yml

Dockerfile

filetree

jest.config.js

package-lock.json

package.json

README.md

tsconfig.json
