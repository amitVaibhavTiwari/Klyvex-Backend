import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { AccountUser } from "../entities/AccountUser.js";
import { UserEmail } from "../entities/UserEmail.js";
import { UserAddress } from "../entities/UserAddress.js";
import { UserPhone } from "../entities/UserPhone.js";
import { Product } from "../entities/Product.js";
import { ProductVariant } from "../entities/ProductVariant.js";
import { ProductCategory } from "../entities/ProductCategory.js";
import { ProductCategoryRelation } from "../entities/ProductCategoryRelation.js";
import { ProductImage } from "../entities/ProductImage.js";
import { Warehouse } from "../entities/Warehouse.js";
import { WarehouseStock } from "../entities/WarehouseStock.js";
import { AdminUser } from "../entities/AdminUser.js";
import { AdminGroups } from "../entities/AdminGroups.js";
import { AdminPermissions } from "../entities/AdminPermissions.js";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  // below one is to synchronize the database with the entities. Don't use in production, use when someone is starting project with their own DB withour running migrations.
  synchronize: false,
  logging: false,
  entities: [
    AdminUser,
    AdminGroups,
    AdminPermissions,
    AccountUser,
    UserEmail,
    UserAddress,
    UserPhone,
    Product,
    ProductVariant,
    ProductCategory,
    ProductCategoryRelation,
    ProductImage,
    Warehouse,
    WarehouseStock,
  ],
  migrations: ["dist/migrations/**/*.js"], // Use .js files in dist folder
});
