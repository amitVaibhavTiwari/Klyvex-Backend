import { MigrationInterface, QueryRunner } from "typeorm";

export class AdminEntities1744628632384 implements MigrationInterface {
    name = 'AdminEntities1744628632384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "isVerified" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "lastOtpSent" text, "lastOtpSentTime" TIMESTAMP, "otpExpiry" TIMESTAMP, "retryCount" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_840ac5cd67be99efa5cd989bf9f" UNIQUE ("email"), CONSTRAINT "PK_a28028ba709cd7e5053a86857b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_permissions" ("id" SERIAL NOT NULL, "permission" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a158f6e04ebba9a428ddc28ff5f" UNIQUE ("permission"), CONSTRAINT "PK_97efc32c48511fc4061111040a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ad66ba6c1e8429756e96cca50dd" UNIQUE ("name"), CONSTRAINT "PK_d80aa6db3c865b38f801c8cc1bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_group_permissions" ("group_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_51347af99a73bbf9dfd8d777c61" PRIMARY KEY ("group_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea3c2dbb8230fc09862bdd58db" ON "admin_group_permissions" ("group_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_710370834f63dfad124046f399" ON "admin_group_permissions" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_group_permissions" ADD CONSTRAINT "FK_ea3c2dbb8230fc09862bdd58db1" FOREIGN KEY ("group_id") REFERENCES "admin_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "admin_group_permissions" ADD CONSTRAINT "FK_710370834f63dfad124046f399b" FOREIGN KEY ("permission_id") REFERENCES "admin_permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_group_permissions" DROP CONSTRAINT "FK_710370834f63dfad124046f399b"`);
        await queryRunner.query(`ALTER TABLE "admin_group_permissions" DROP CONSTRAINT "FK_ea3c2dbb8230fc09862bdd58db1"`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`DROP INDEX "public"."IDX_710370834f63dfad124046f399"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea3c2dbb8230fc09862bdd58db"`);
        await queryRunner.query(`DROP TABLE "admin_group_permissions"`);
        await queryRunner.query(`DROP TABLE "admin_groups"`);
        await queryRunner.query(`DROP TABLE "admin_permissions"`);
        await queryRunner.query(`DROP TABLE "admin_user"`);
    }

}
