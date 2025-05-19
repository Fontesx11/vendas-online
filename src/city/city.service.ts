import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CityService {

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[]> {
    return this.cacheService.getCache<CityEntity[]>(`state_${stateId}`,
      () =>
        this.cityRepository.find({
          where:{
            stateId,
          }
        })
    );
  }

  async findCityById(cityId: number): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where:{
        id: cityId,
      }
    });

    if(!city) throw new NotFoundException(`CityId Not Found`);

    return city;
  }

  async findCityByName(cityName: string, stateName: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where:{
        name: cityName,
        state:{
          uf: stateName
        }
      },
      relations:{
        state: true,
      }
    });

    if(!city) throw new NotFoundException(`City not Found`);

    return city;
  }

}
