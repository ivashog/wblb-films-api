import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendsFilmAndActorTables1582421878495 implements MigrationInterface {
    name = 'ExtendsFilmAndActorTables1582421878495';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "public"."films"
                ADD "created_at" TIMESTAMP(0) NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."actors"
                ADD "films_count" integer NOT NULL DEFAULT 1
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."actors"
                ADD "created_at" TIMESTAMP(0) NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."actors"
                ADD "updated_at" TIMESTAMP(0) NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_FILMS__NAME"
                ON "public"."films" ("name")
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_ACTORS__FULL_NAME"
                ON "public"."actors" ("full_name")
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."films"
                ADD CONSTRAINT "UQ_FILMS_NAME_RELEASE_YEAR"
                    UNIQUE ("name", "release_year")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."films" DROP CONSTRAINT "UQ_FILMS_NAME_RELEASE_YEAR"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ACTORS__FULL_NAME"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_FILMS__NAME"`);
        await queryRunner.query(`ALTER TABLE "public"."actors" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "public"."actors" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "public"."actors" DROP COLUMN "films_count"`);
        await queryRunner.query(`ALTER TABLE "public"."films" DROP COLUMN "created_at"`);
    }
}
