import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEmail,
  IsUrl,
} from "class-validator";
import { type User } from "../../Types.js";

export class createStaffMemberDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @IsNotEmpty()
  user: User;
}

export class sendStaffInvitationLinkDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsUrl()
  @IsNotEmpty()
  URL: string;

  @IsNotEmpty()
  user: User;
}

export class changeStaffMemberGroupDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @IsNotEmpty()
  user: User;
}

export class deleteStaffMemberDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user: User;
}
