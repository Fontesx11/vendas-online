import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityEntity } from '../entities/city.entity';
import { CityService } from '../city.service'; 
import { cityMock } from '../__mocks__/city.mock';
import { CacheService } from '../../cache/cache.service';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CityService,
        {
        provide: CacheService,
        useValue:{
          getCache: jest.fn().mockResolvedValue([cityMock]),
        }
        },
       {
        provide: getRepositoryToken(CityEntity),
        useValue: {
          findOne: jest.fn().mockResolvedValue(cityMock),
        },
       }
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
  });

  it('should return FindOne City', async () => {
    const city = await service.findCityById(cityMock.id);
    expect(city).toEqual(cityMock);
  });

  it('should return error FindOne not found', async () => {
    jest.spyOn(cityRepository, 'findOne').mockResolvedValue(null);
    expect(service.findCityById(cityMock.id)).rejects.toThrow();
  });

  it('should return cities in getAllCitiesByStateId', async () => {
    const city = await service.getAllCitiesByStateId(cityMock.id);
    expect(city).toEqual([cityMock]);
  });

});
