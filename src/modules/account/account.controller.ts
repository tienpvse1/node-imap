import { Controller, Delete, Get, Post } from "@overnightjs/core";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { dataSource } from "../database/datasource";
import { Account } from "./entity/account.entity";

@Controller("account")
// Or instead of using @Wrapper below you could use @ClassWrapper here
export class AccountController {
  repository = dataSource.getRepository(Account);
  @Get("")
  async getAllAccount(req: Request, res: Response) {
    const data = await this.repository.find();
    return res.status(200).json(data);
  }

  @Get(":id")
  async asyncThirdParty(req: Request, res: Response) {
    const data = await this.repository.findOne({ where: { id: "12" } });
    return res.status(200).json(data);
  }

  @Post()
  async createAccount(req: Request, res: Response) {
    try {
      const body: Account = req.body;
      const errors = await validate(body);
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
