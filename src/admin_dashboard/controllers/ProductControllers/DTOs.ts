import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsNotEmpty,
  Length,
  IsObject,
  IsBoolean,
} from "class-validator";
import { type User } from "../../Types.js";

export class AddNewProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsObject()
  price: Record<string, any>;

  @IsOptional()
  @IsString()
  categoryId?: number;

  @IsOptional()
  @IsObject()
  productMetaData?: Record<string, any>;

  @IsOptional()
  @IsObject()
  variantMetaData?: Record<string, any>;

  @IsOptional()
  @IsObject()
  tax?: Record<string, any>;

  @IsOptional()
  @IsString()
  @Length(20, 2000)
  description?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  height?: string;

  @IsOptional()
  @IsNumber()
  width?: string;

  @IsOptional()
  @IsNumber()
  weight?: string;

  @IsOptional()
  @IsNumber()
  length?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsNotEmpty()
  user: User;
}

export class AddNewProductCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  parentCategoryId?: number;

  @IsOptional()
  @IsObject()
  metaData?: Record<string, any>;

  @IsNotEmpty()
  user: User;
}

export class AddNewProductVariantDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsObject()
  price?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metaData?: Record<string, any>;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsNotEmpty()
  user: User;
}

export class AddProductToCategoryDTO {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  user: User;
}

export class DeleteProductFromCategoryDTO {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  user: User;
}

export class AddNewVariantToProductDTO {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsOptional()
  @IsObject()
  price?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsObject()
  tax?: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsString()
  width?: string;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsString()
  length?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsNotEmpty()
  user: User;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class DeleteVariantFromProductDTO {
  @IsNotEmpty()
  @IsString()
  variantId: string;

  @IsNotEmpty()
  user: User;
}

export class DeleteProductDTO {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  user: User;
}

export class DeleteProductCategoryDTO {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  user: User;
}
