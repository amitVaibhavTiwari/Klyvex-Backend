import { MigrationInterface, QueryRunner } from "typeorm";

export class PrimaryKeyColumnAdded1748941085071 implements MigrationInterface {
    name = 'PrimaryKeyColumnAdded1748941085071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2"`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_c73b8527a67e80b2f5067582878"`);
        await queryRunner.query(`ALTER TABLE "product_image" ALTER COLUMN "productId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_image" ALTER COLUMN "productVariantId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_0b04d796ca1ccf04f11337cd903"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_3b428dd94da788ba06938ccd063"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ALTER COLUMN "productVariantId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ALTER COLUMN "warehouseId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "FK_6e420052844edf3a5506d863ce6"`);
        await queryRunner.query(`ALTER TABLE "product_variant" ALTER COLUMN "productId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" DROP CONSTRAINT "FK_e72d4be32cb4abe6880cac54d08"`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" DROP CONSTRAINT "FK_1fa40ebd02cea8e8544a3a876ba"`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ALTER COLUMN "productId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ALTER COLUMN "categoryId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_c73b8527a67e80b2f5067582878" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_0b04d796ca1ccf04f11337cd903" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_3b428dd94da788ba06938ccd063" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD CONSTRAINT "FK_6e420052844edf3a5506d863ce6" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ADD CONSTRAINT "FK_e72d4be32cb4abe6880cac54d08" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ADD CONSTRAINT "FK_1fa40ebd02cea8e8544a3a876ba" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category_relation" DROP CONSTRAINT "FK_1fa40ebd02cea8e8544a3a876ba"`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" DROP CONSTRAINT "FK_e72d4be32cb4abe6880cac54d08"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "FK_6e420052844edf3a5506d863ce6"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_3b428dd94da788ba06938ccd063"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_0b04d796ca1ccf04f11337cd903"`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_c73b8527a67e80b2f5067582878"`);
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2"`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "admin_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ALTER COLUMN "categoryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ALTER COLUMN "productId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ADD CONSTRAINT "FK_1fa40ebd02cea8e8544a3a876ba" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category_relation" ADD CONSTRAINT "FK_e72d4be32cb4abe6880cac54d08" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variant" ALTER COLUMN "productId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD CONSTRAINT "FK_6e420052844edf3a5506d863ce6" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ALTER COLUMN "warehouseId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ALTER COLUMN "productVariantId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_3b428dd94da788ba06938ccd063" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_0b04d796ca1ccf04f11337cd903" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_image" ALTER COLUMN "productVariantId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_image" ALTER COLUMN "productId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_c73b8527a67e80b2f5067582878" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account_user" ALTER COLUMN "tokenId" SET DEFAULT uuid_generate_v4()`);
    }

}
