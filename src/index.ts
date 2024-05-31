import * as dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import authRouter from "./routes";

import { socketIoAuth } from "./middlewares/tokenVerifiy";
import { connectionHandler } from "./middlewares/socketHandler";

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use(socketIoAuth);

io.on("connection", connectionHandler);

AppDataSource.initialize()
  .then(async () => {
    app.use(bodyParser.json());

    app.use("/auth", authRouter);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });

    app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({ error: "Not Found" });
    });

    server.listen(process.env.PORT, () => {
      console.log(
        `Express and Socket.io server has started on port ${process.env.PORT}. \n http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => console.log(error));
