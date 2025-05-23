import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { userEntityMock } from '../../user/__Mock__/user.mock';


describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: Cache;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => userEntityMock,
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get(CACHE_MANAGER);
   
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return data in cache', async () => {
    const user = await service.getCache('anyKey', () => Promise.resolve(null));
  
    expect(user).toEqual(userEntityMock);
  }); 

  it('should return data in function', async () => {
    const result = { test: 'tes' };
    jest.spyOn(cacheManager, 'get').mockResolvedValue(undefined);

    const user = await service.getCache('key', () => Promise.resolve(result));

    expect(user).toEqual(result);
  });
  
});
