import { MigrationInterface, QueryRunner } from 'typeorm';

export class FillFormatsDict1582416150808 implements MigrationInterface {
    name = 'FillFormatsDict1582416150808';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            INSERT INTO public.formats_dict (name) VALUES
                ('VHS'),
                ('DVD'),
                ('Blu-Ray');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            TRUNCATE public.formats_dict CASCADE;
            SELECT pg_catalog.setval('public.formats_dict_id_seq', 1, false);
        `);
    }
}
