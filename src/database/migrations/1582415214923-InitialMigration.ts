import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1582415214923 implements MigrationInterface {
    name = 'InitialMigration1582415214923';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "public"."formats_dict" (
                "id" SMALLSERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "PK_FORMATS_DICT__ID" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."films" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "release_year" smallint NOT NULL,
                "format_id" smallint,
                CONSTRAINT "PK_FILMS__ID"
                    PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."film_actors" (
                "film_id" integer NOT NULL,
                "actor_id" integer NOT NULL,
                CONSTRAINT "PK_FILM_ACTORS__ACTOR_ID_FILM_ID"
                    PRIMARY KEY ("film_id", "actor_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."actors" (
                "id" SERIAL NOT NULL,
                "full_name" character varying NOT NULL,
                CONSTRAINT "PK_ACTORS__ID"
                    PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."films"
                ADD CONSTRAINT "FK_FILMS__FORMAT_ID__FORMATS_DICT__ID"
                    FOREIGN KEY ("format_id")
                    REFERENCES "public"."formats_dict"("id")
                    ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."film_actors"
                ADD CONSTRAINT "FK_FILM_ACTORS__FILM_ID__FILMS__ID"
                    FOREIGN KEY ("film_id")
                    REFERENCES "public"."films"("id")
                    ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."film_actors"
                ADD CONSTRAINT "FK_FILM_ACTORS__ACTOR_ID__ACTORS__ID"
                    FOREIGN KEY ("actor_id")
                    REFERENCES "public"."actors"("id")
                    ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "public"."film_actors"
                DROP CONSTRAINT "FK_FILM_ACTORS__ACTOR_ID__ACTORS__ID"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."film_actors"
                DROP CONSTRAINT "FK_FILM_ACTORS__FILM_ID__FILMS__ID"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."films"
                DROP CONSTRAINT "FK_FILMS__FORMAT_ID__FORMATS_DICT__ID"
        `);
        await queryRunner.query(`DROP TABLE "public"."actors"`);
        await queryRunner.query(`DROP TABLE "public"."film_actors"`);
        await queryRunner.query(`DROP TABLE "public"."films"`);
        await queryRunner.query(`DROP TABLE "public"."formats_dict"`);
    }
}
