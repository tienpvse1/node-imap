import { Controller, Delete, Get, Post } from "@overnightjs/core";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { dataSource } from "../database/datasource";
import { Webhook } from "./entity/webhook.entity";

@Controller("webhook")
// Or instead of using @Wrapper below you could use @ClassWrapper here
export class WebhookController {
  repository = dataSource.getRepository(Webhook);
  @Get("")
  async getAllWebhook(req: Request, res: Response) {
    const data = await this.repository.find();
    return res.status(200).json(data);
  }

  @Post()
  async createWebhook(req: Request, res: Response) {
    try {
      const body: Webhook = req.body;
      const errors = await validate(body);
      const hook = await this.repository.find();
      if (hook.length > 0) throw new Error();

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }
      const { identifiers } = await this.repository.insert(body);
      return res.status(200).json(identifiers);
    } catch (error) {
      return res.status(400).json({ message: ["cannot create"] });
    }
  }

  @Delete(":id")
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await this.repository.delete(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: ["cannot delete"] });
    }
  }
}
