import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductType1749911507166 implements MigrationInterface {
    name = 'ProductType1749911507166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "variantAttributes" jsonb, "productAttributes" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e0843930fbb8854fe36ca39dae1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "width"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "length"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "metaData"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "metaData"`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "sku" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "attributes" jsonb`);
        await queryRunner.query(`ALTER TABLE "product" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD "thumbnail" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD "attributes" jsonb`);
        await queryRunner.query(`ALTER TABLE "product" ADD "productTypeId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98" FOREIGN KEY ("productTypeId") REFERENCES "product_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_374bfd0d1b0e1398d7206456d98"`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productTypeId"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "attributes"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "thumbnail"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "attributes"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "sku"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "metaData" jsonb`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "metaData" jsonb`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "color" character varying`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "weight" character varying`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "length" character varying`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "width" character varying`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "height" character varying`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "size" character varying`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD "isActive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "product_type"`);
    }

}
