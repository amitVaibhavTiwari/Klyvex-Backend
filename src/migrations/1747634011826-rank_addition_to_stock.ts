import { MigrationInterface, QueryRunner } from "typeorm";

export class RankAdditionToStock1747634011826 implements MigrationInterface {
    name = 'RankAdditionToStock1747634011826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" ADD "isActive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD "isActive" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD "rank" integer`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP COLUMN "stockQuantity"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD "stockQuantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP COLUMN "stockQuantity"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD "stockQuantity" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP COLUMN "isActive"`);
    }

}
