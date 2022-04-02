import axios from "axios";
import { schedule } from "node-cron";
import { generateConfig, getEmails } from "../email";
import { Account } from "../modules/account/entity/account.entity";
import { dataSource } from "../modules/database/datasource";
import { Webhook } from "../modules/webhook/entity/webhook.entity";

const repository = dataSource.getRepository(Account);
const webhookRepository = dataSource.getRepository(Webhook);
export const cron = schedule(
  "*/45 * * * * *",
  async () => {
    try {
      const [hook] = await webhookRepository.find();
      const result = await repository.find();
      if (hook) {
        console.log("called");

        for (const account of result) {
          const config = generateConfig(account.email, account.password);
          getEmails(config, (body: any) => {
            axios.post(hook.url, body);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  {}
);
