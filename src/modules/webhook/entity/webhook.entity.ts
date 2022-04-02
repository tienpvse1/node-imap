import { IsUrl } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("webhook")
export class Webhook extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "webhook_url" })
  @IsUrl()
  url: string;
}
