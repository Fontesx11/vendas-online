import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
  CacheModule, 
  TypeOrmModule.forFeature([CityEntity])],
  providers: [CityService],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}
