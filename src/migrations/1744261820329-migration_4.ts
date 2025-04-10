import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration41744261820329 implements MigrationInterface {
    name = 'Migration41744261820329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_image" ("id" SERIAL NOT NULL, "imageUrl" character varying NOT NULL, "rank" character varying, "metaData" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, "productVariantId" uuid, CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" SERIAL NOT NULL, "address" jsonb NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "metaData" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouse_stock" ("id" SERIAL NOT NULL, "stockQuantity" character varying NOT NULL DEFAULT '0', "reservedQuantity" character varying NOT NULL DEFAULT '0', "metaData" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productVariantId" uuid, "warehouseId" integer, CONSTRAINT "PK_322b20c9d37694411ea10c733c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_variant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" jsonb, "tax" jsonb, "description" character varying, "size" character varying, "height" character varying, "width" character varying, "length" character varying, "weight" character varying, "color" character varying, "allowBackorder" boolean NOT NULL DEFAULT false, "metaData" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "metaData" jsonb, "isActive" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_category_relation" ("id" SERIAL NOT NULL, "productId" uuid, "categoryId" integer, CONSTRAINT "PK_2a8380e4106531804dd84bb3cd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "slug" character varying NOT NULL, "metaData" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_email" DROP COLUMN "lastOtpSent"`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD "lastOtpSent" text`);
        await queryRunner.query(`ALTER TABLE "user_phone" DROP COLUMN "lastOtpSent"`);
        await queryRunner.query(`ALTER TABLE "user_phone" ADD "lastOtpSent" text`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_c73b8527a67e80b2f5067582878" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_0b04d796ca1ccf04f11337cd903" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_3b428dd94da788ba06938ccd063" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD CONSTRAINT "FK_6e420052844edf3a5506d863ce6" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ADD CONSTRAINT "FK_e72d4be32cb4abe6880cac54d08" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ADD CONSTRAINT "FK_1fa40ebd02cea8e8544a3a876ba" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category_relation" DROP CONSTRAINT "FK_1fa40ebd02cea8e8544a3a876ba"`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" DROP CONSTRAINT "FK_e72d4be32cb4abe6880cac54d08"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "FK_6e420052844edf3a5506d863ce6"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_3b428dd94da788ba06938ccd063"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_0b04d796ca1ccf04f11337cd903"`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_c73b8527a67e80b2f5067582878"`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2"`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_phone" DROP COLUMN "lastOtpSent"`);
        await queryRunner.query(`ALTER TABLE "user_phone" ADD "lastOtpSent" character varying`);
        await queryRunner.query(`ALTER TABLE "user_email" DROP COLUMN "lastOtpSent"`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD "lastOtpSent" character varying`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "product_category_relation"`);
        await queryRunner.query(`DROP TABLE "product_category"`);
        await queryRunner.query(`DROP TABLE "product_variant"`);
        await queryRunner.query(`DROP TABLE "warehouse_stock"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`DROP TABLE "product_image"`);
    }

}
