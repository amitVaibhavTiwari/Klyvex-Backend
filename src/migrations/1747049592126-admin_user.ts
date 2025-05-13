import { MigrationInterface, QueryRunner } from "typeorm";

export class AdminUser1747049592126 implements MigrationInterface {
    name = 'AdminUser1747049592126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" ADD "tokenId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD CONSTRAINT "UQ_cd354244ec870baeb7cd1d4dafc" UNIQUE ("tokenId")`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_user" DROP CONSTRAINT "UQ_cd354244ec870baeb7cd1d4dafc"`);
        await queryRunner.query(`ALTER TABLE "admin_user" DROP COLUMN "tokenId"`);
    }

}
