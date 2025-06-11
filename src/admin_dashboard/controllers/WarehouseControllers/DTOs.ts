import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsObject,
} from "class-validator";
import { type User } from "../../Types.js";

export class addWarehouseDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsObject()
  address?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsNotEmpty()
  user: User;
}

export class addProductToWarehouseDTO {
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number;

  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsNumber()
  @IsOptional()
  stockQuantity?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsNotEmpty()
  user: User;
}

export class editWarehouseStockDTO {
  @IsNumber()
  @IsNotEmpty()
  stockId: number;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;

  @IsNotEmpty()
  user: User;
}

export class deleteWarehouseStockDTO {
  @IsNumber()
  @IsNotEmpty()
  stockId: number;

  @IsNotEmpty()
  user: User;
}
