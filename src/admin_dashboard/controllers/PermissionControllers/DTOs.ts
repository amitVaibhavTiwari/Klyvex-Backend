import { IsString, IsNumber, IsNotEmpty } from "class-validator";
import { type User } from "../../Types.js";

export class CreatePermissionDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  user: User;
}

export class CreatePermissionGroupDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  user: User;
}

export class AddPermissionToGroupDTO {
  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @IsNumber()
  @IsNotEmpty()
  permissionId: number;

  @IsNotEmpty()
  user: User;
}

export class DeletePermissionFromGroupDTO {
  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @IsNumber()
  @IsNotEmpty()
  permissionId: number;

  @IsNotEmpty()
  user: User;
}
