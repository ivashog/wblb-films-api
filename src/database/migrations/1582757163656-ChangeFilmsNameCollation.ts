import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFilmsNameCollation1582757163656 implements MigrationInterface {
    name = 'ChangeFilmsNameCollation1582415214923';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE films
                ALTER COLUMN name
                    SET DATA TYPE character varying(255) COLLATE "C"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE films
                ALTER COLUMN name
                    SET DATA TYPE character varying(255) COLLATE "default"
        `);
    }
}
