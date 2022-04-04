import { Server } from "@overnightjs/core";
import * as bodyParser from "body-parser";
import { AccountController } from "./src/modules/account/account.controller";
import { dataSource } from "./src/modules/database/datasource";
import { WebhookController } from "./src/modules/webhook/webhook.controller";
import cors from "cors";
import { cron } from "./src/schedule/cron";
import { config } from "dotenv";
import { EmailController } from "./src/modules/email/email.controller";
export class EmailServer extends Server {
  constructor() {
    config();
    super(process.env.NODE_ENV === "development"); // setting showLogs to true
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.setupControllers();
  }

  private setupControllers(): void {
    const accountController = new AccountController();
    const webhookController = new WebhookController();
    const emailController = new EmailController();
    // super.addControllers() must be called, and can be passed a single controller or an array of
    // controllers. Optional router object can also be passed as second argument.
    super.addControllers([
      accountController,
      webhookController,
      emailController,
    ]);
  }

  public start(port: number): void {
    dataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
    this.app.listen(port, () => {
      console.log("listening at port 8080");
    });
  }
}

const emailServer = new EmailServer();
cron.start();
emailServer.start(8080);
