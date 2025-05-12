import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StateEntity } from '../entities/state.entity';
import { StateService } from '../state.service';
import { stateMock } from '../__mocks__/state.mock';

describe('StateService', () => {
  let service: StateService;
  let stateRepository: Repository<StateEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StateService,
       {
        provide: getRepositoryToken(StateEntity),
        useValue: {
          find: jest.fn().mockResolvedValue([stateMock]),
        },
       }
      ],
    }).compile();

    service = module.get<StateService>(StateService);
    stateRepository = module.get<Repository<StateEntity>>(
      getRepositoryToken(StateEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(stateRepository).toBeDefined();
  });

  it('should be return list of states', async () => {
  const states = await service.getAllState();
  expect(states).toEqual([stateMock]);
  });

  it('should be return error in exception', async () => {
  jest.spyOn(stateRepository, 'find').mockRejectedValueOnce(new Error());
  expect(service.getAllState()).rejects.toThrow();
  });

});
