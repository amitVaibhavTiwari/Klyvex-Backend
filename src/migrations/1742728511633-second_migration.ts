import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondMigration1742728511633 implements MigrationInterface {
    name = 'SecondMigration1742728511633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_email" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "lastOtpSent" character varying, "lastOtpSentTime" TIMESTAMP, "otpExpiry" TIMESTAMP, "retryCount" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_95c07c16136adcfdcb8221c1fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_phone" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone" character varying(15), "isVerified" boolean NOT NULL, "lastOtpSent" character varying, "lastOtpSentTime" TIMESTAMP, "otpExpiry" TIMESTAMP, "retryCount" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_8b544a5b4edf9ab1e479c5466f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "metaData" jsonb, CONSTRAINT "UQ_63301650f99948e1ff5e0af00b5" UNIQUE ("tokenId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_email" ADD CONSTRAINT "FK_9ada349d19d368d20fbf613eef9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_phone" ADD CONSTRAINT "FK_1a921efc6d5620e9018fd304825" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_address" ADD CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_address" DROP CONSTRAINT "FK_1abd8badc4a127b0f357d9ecbc2"`);
        await queryRunner.query(`ALTER TABLE "user_phone" DROP CONSTRAINT "FK_1a921efc6d5620e9018fd304825"`);
        await queryRunner.query(`ALTER TABLE "user_email" DROP CONSTRAINT "FK_9ada349d19d368d20fbf613eef9"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_address"`);
        await queryRunner.query(`DROP TABLE "user_phone"`);
        await queryRunner.query(`DROP TABLE "user_email"`);
    }

}
