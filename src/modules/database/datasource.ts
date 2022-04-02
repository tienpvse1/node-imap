import { DataSource } from "typeorm";
import { Account } from "../account/entity/account.entity";
import { Webhook } from "../webhook/entity/webhook.entity";

export const dataSource = new DataSource({
  type: "mysql",
  host: "db",
  port: 3306,
  username: "root",
  password: "123456",
  database: "prepared",
  entities: [Account, Webhook],
  logger: "advanced-console",
  synchronize: true,
});
