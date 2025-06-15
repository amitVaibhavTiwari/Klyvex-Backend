import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsNotEmpty,
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
  sku: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsObject()
  @IsNotEmpty()
  price: Record<string, any>;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsNotEmpty()
  @IsNumber()
  productTypeId: number;

  @IsOptional()
  @IsObject()
  productAttributes?: Record<string, any>;

  @IsOptional()
  @IsObject()
  variantAttributes?: Record<string, any>;

  @IsOptional()
  @IsObject()
  tax?: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;

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

  @IsNotEmpty()
  @IsObject()
  price: Record<string, any>;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @IsOptional()
  @IsObject()
  tax?: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  sku: string;

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

export class AddNewProductTypeDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsObject()
  productAttributes?: Record<string, any>;

  @IsOptional()
  @IsObject()
  variantAttributes?: Record<string, any>;

  @IsNotEmpty()
  user: User;
}

export class EditProductVariantDTO {
  @IsNotEmpty()
  @IsString()
  variantId: string;

  @IsOptional()
  @IsObject()
  price?: Record<string, any>;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @IsOptional()
  @IsObject()
  tax?: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsNotEmpty()
  user: User;
}
