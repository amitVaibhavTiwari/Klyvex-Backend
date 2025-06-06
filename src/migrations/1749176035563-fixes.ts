import { MigrationInterface, QueryRunner } from "typeorm";

export class Fixes1749176035563 implements MigrationInterface {
    name = 'Fixes1749176035563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "isDefault" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "admin_groups" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user_email" DROP CONSTRAINT "FK_2bdae300d31cc5cce7fb95ab632"`);
        await queryRunner.query(`ALTER TABLE "user_email" ALTER COLUMN "accountUserId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_phone" DROP CONSTRAINT "FK_d59b4550949c6db54598394adaf"`);
        await queryRunner.query(`ALTER TABLE "user_phone" ALTER COLUMN "accountUserId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_c3daa9e11ff50c64dc7e85c41cf"`);
        await queryRunner.query(`ALTER TABLE "user_address" ALTER COLUMN "accountUserId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_user" DROP CONSTRAINT "FK_02cc8d77d77d94d0472994b687f"`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "adminGroupsId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD CONSTRAINT "FK_2bdae300d31cc5cce7fb95ab632" FOREIGN KEY ("accountUserId") REFERENCES "account_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone" ADD CONSTRAINT "FK_d59b4550949c6db54598394adaf" FOREIGN KEY ("accountUserId") REFERENCES "account_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_c3daa9e11ff50c64dc7e85c41cf" FOREIGN KEY ("accountUserId") REFERENCES "account_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD CONSTRAINT "FK_02cc8d77d77d94d0472994b687f" FOREIGN KEY ("adminGroupsId") REFERENCES "admin_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" DROP CONSTRAINT "FK_02cc8d77d77d94d0472994b687f"`);
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_c3daa9e11ff50c64dc7e85c41cf"`);
        await queryRunner.query(`ALTER TABLE "user_phone" DROP CONSTRAINT "FK_d59b4550949c6db54598394adaf"`);
        await queryRunner.query(`ALTER TABLE "user_email" DROP CONSTRAINT "FK_2bdae300d31cc5cce7fb95ab632"`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "adminGroupsId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD CONSTRAINT "FK_02cc8d77d77d94d0472994b687f" FOREIGN KEY ("adminGroupsId") REFERENCES "admin_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_address" ALTER COLUMN "accountUserId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_c3daa9e11ff50c64dc7e85c41cf" FOREIGN KEY ("accountUserId") REFERENCES "account_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone" ALTER COLUMN "accountUserId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_phone" ADD CONSTRAINT "FK_d59b4550949c6db54598394adaf" FOREIGN KEY ("accountUserId") REFERENCES "account_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_email" ALTER COLUMN "accountUserId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD CONSTRAINT "FK_2bdae300d31cc5cce7fb95ab632" FOREIGN KEY ("accountUserId") REFERENCES "account_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_groups" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "isDefault"`);
    }

}
