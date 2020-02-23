import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';

describe('Films Controller', () => {
    let controller: FilmsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FilmsController],
        }).compile();

        controller = module.get<FilmsController>(FilmsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
