import { MigrationInterface, QueryRunner } from "typeorm";

export class ShopMeta1750164689543 implements MigrationInterface {
    name = 'ShopMeta1750164689543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shop_meta" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3ba1335ab52eefe5fbb8f5a4445" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP COLUMN "reservedQuantity"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD "reservedQuantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP COLUMN "reservedQuantity"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD "reservedQuantity" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`DROP TABLE "shop_meta"`);
    }

}
