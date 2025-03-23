import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { AccountUser } from "../entities/AccountUser.js";
import { UserEmail } from "../entities/UserEmail.js";
import { UserAddress } from "../entities/UserAddress.js";
import { UserPhone } from "../entities/UserPhone.js";
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
  entities: [AccountUser, UserEmail, UserAddress, UserPhone],
  migrations: ["dist/migrations/**/*.js"], // Use .js files in dist folder
});
