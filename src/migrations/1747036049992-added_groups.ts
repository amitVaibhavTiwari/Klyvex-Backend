import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedGroups1747036049992 implements MigrationInterface {
    name = 'AddedGroups1747036049992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD "adminGroupsId" integer`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_user" ADD CONSTRAINT "FK_02cc8d77d77d94d0472994b687f" FOREIGN KEY ("adminGroupsId") REFERENCES "admin_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_user" DROP CONSTRAINT "FK_02cc8d77d77d94d0472994b687f"`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_user" DROP COLUMN "adminGroupsId"`);
        await queryRunner.query(`ALTER TABLE "admin_user" DROP COLUMN "name"`);
    }

}
