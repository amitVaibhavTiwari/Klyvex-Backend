import { AppDataSource } from "../dataSource/dataSource.js";
import { Books } from "../entities/Books.js";
import { Librarians } from "../entities/librarians.js";
import { Loans } from "../entities/Loans.js";
import { Students } from "../entities/students.js";
import { AccountUser } from "../entities/AccountUser.js";
import { UserAddress } from "../entities/UserAddress.js";
import { UserEmail } from "../entities/UserEmail.js";
import { UserPhone } from "../entities/UserPhone.js";
import { AdminUser } from "../entities/AdminUser.js";
import { AdminPermissions } from "../entities/AdminPermissions.js";
import { AdminGroups } from "../entities/AdminGroups.js";
import { Product } from "../entities/Product.js";
import { ProductVariant } from "../entities/ProductVariant.js";
import { ProductCategory } from "../entities/ProductCategory.js";
import { ProductCategoryRelation } from "../entities/ProductCategoryRelation.js";
import { ProductImage } from "../entities/ProductImage.js";
import { Warehouse } from "../entities/Warehouse.js";
import { WarehouseStock } from "../entities/WarehouseStock.js";
import { ProductType } from "../entities/ProductType.js";
import { ShopMeta } from "../entities/ShopMeta.js";

export const bookRepository = AppDataSource.getRepository(Books);
export const librarianRepository = AppDataSource.getRepository(Librarians);
export const studentRepository = AppDataSource.getRepository(Students);
export const loanRepository = AppDataSource.getRepository(Loans);
// delete above repositories later
export const accountUserRepository = AppDataSource.getRepository(AccountUser);
export const userEmailRepository = AppDataSource.getRepository(UserEmail);
export const userPhoneRepository = AppDataSource.getRepository(UserPhone);
export const userAddressRepository = AppDataSource.getRepository(UserAddress);
export const adminUserRepository = AppDataSource.getRepository(AdminUser);
export const permissionGroupRepository =
  AppDataSource.getRepository(AdminGroups);
export const permissionRepository =
  AppDataSource.getRepository(AdminPermissions);
export const productRepository = AppDataSource.getRepository(Product);
export const productVariantRepository =
  AppDataSource.getRepository(ProductVariant);
export const productCategoryRepository =
  AppDataSource.getRepository(ProductCategory);
export const productCategoryRelationRepository = AppDataSource.getRepository(
  ProductCategoryRelation
);
export const productImageRepository = AppDataSource.getRepository(ProductImage);
export const warehouseRepository = AppDataSource.getRepository(Warehouse);
export const warehouseStockRepository =
  AppDataSource.getRepository(WarehouseStock);
export const productTypeRepository = AppDataSource.getRepository(ProductType);
export const shopMetaRepository = AppDataSource.getRepository(ShopMeta);
