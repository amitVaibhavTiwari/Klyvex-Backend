import { MigrationInterface, QueryRunner } from "typeorm";

export class AnotherMigration1749470714961 implements MigrationInterface {
    name = 'AnotherMigration1749470714961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "allowBackorder"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD "allowBackorder" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP COLUMN "allowBackorder"`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "allowBackorder" boolean NOT NULL DEFAULT false`);
    }

}
