import { IsEmail, IsString, Length } from "class-validator";
import { BaseEntity, Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
export class Account extends BaseEntity {
  @PrimaryColumn()
  @Length(10)
  id: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  @Index({ unique: true })
  username: string;
}
