import { Controller, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { generateTransporter } from "../../email";
import { Account } from "../account/entity/account.entity";
import { dataSource } from "../database/datasource";
import { SendEmailDto } from "./dto/send-email.dto";

@Controller("email")
// Or instead of using @Wrapper below you could use @ClassWrapper here
export class EmailController {
  @Post("send")
  async sendEmail(req: Request, res: Response) {
    const dto: SendEmailDto = req.body;
    const sender = await dataSource.getRepository(Account).findOne({
      where: {
        email: dto.from.address,
      },
    });
    if (!sender)
      return res.status(404).json({ message: "sender email not found" });
    let info = await generateTransporter(
      sender.email,
      sender.password
    ).sendMail({
      from: sender.email, // sender address
      to: dto.to[0].address, // list of receivers
      subject: dto.subject, // Subject line
      html: dto.html, // html body
      date: dto.sendAt,
    });

    return res.status(200).json(info);
  }
}
