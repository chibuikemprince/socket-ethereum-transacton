import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "SG-socketdb-8607-mysql-master.servers.mongodirector.com",
  port: 3306,
  username: "sgroot",
  password: "XBsmt#g6o2uEytcu",
  database: "socketdb-users",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
