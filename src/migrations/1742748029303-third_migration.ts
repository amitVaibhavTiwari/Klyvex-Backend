import { MigrationInterface, QueryRunner } from "typeorm";

export class ThirdMigration1742748029303 implements MigrationInterface {
    name = 'ThirdMigration1742748029303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_email" DROP CONSTRAINT "FK_9ada349d19d368d20fbf613eef9"`);
        await queryRunner.query(`ALTER TABLE "user_phone" DROP CONSTRAINT "FK_1a921efc6d5620e9018fd304825"`);
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2"`);
        await queryRunner.query(`ALTER TABLE "user_phone" RENAME COLUMN "userId" TO "accountUserId"`);
        await queryRunner.query(`ALTER TABLE "user_address" RENAME COLUMN "userId" TO "accountUserId"`);
        await queryRunner.query(`CREATE TABLE "account_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "metaData" jsonb, CONSTRAINT "UQ_dcce6468e3a6dbd672a43b21507" UNIQUE ("tokenId"), CONSTRAINT "PK_efef1e5fdbe318a379c06678c51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_email" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD "accountUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD CONSTRAINT "UQ_f2bff75d7c18f08db06f81934b6" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD CONSTRAINT "FK_2bdae300d31cc5cce7fb95ab632" FOREIGN KEY ("accountUserId") REFERENCES "account_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone" ADD CONSTRAINT "FK_d59b4550949c6db54598394adaf" FOREIGN KEY ("accountUserId") REFERENCES "account_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_c3daa9e11ff50c64dc7e85c41cf" FOREIGN KEY ("accountUserId") REFERENCES "account_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_c3daa9e11ff50c64dc7e85c41cf"`);
        await queryRunner.query(`ALTER TABLE "user_phone" DROP CONSTRAINT "FK_d59b4550949c6db54598394adaf"`);
        await queryRunner.query(`ALTER TABLE "user_email" DROP CONSTRAINT "FK_2bdae300d31cc5cce7fb95ab632"`);
        await queryRunner.query(`ALTER TABLE "user_email" DROP CONSTRAINT "UQ_f2bff75d7c18f08db06f81934b6"`);
        await queryRunner.query(`ALTER TABLE "user_email" DROP COLUMN "accountUserId"`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD "userId" uuid`);
        await queryRunner.query(`DROP TABLE "account_user"`);
        await queryRunner.query(`ALTER TABLE "user_address" RENAME COLUMN "accountUserId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "user_phone" RENAME COLUMN "accountUserId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone" ADD CONSTRAINT "FK_1a921efc6d5620e9018fd304825" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD CONSTRAINT "FK_9ada349d19d368d20fbf613eef9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
