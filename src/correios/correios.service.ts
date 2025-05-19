import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ReturnCep } from './dtos/return-cep.dto';
import { CityService } from 'src/city/city.service';
import { ReturnCepExternal } from './dtos/return-external-cep.dto';
import { CityEntity } from 'src/city/entities/city.entity';



@Injectable()
export class CorreiosService {
    URL_CORREIOS = process.env.URL_CEP_CORREIOS;

    constructor(
        private readonly httpService: HttpService,
        private readonly cityService: CityService,
    ) {}

  async findAddressByCEP(cep: string): Promise<ReturnCep> {

    if (!this.URL_CORREIOS) {
      throw new Error('URL_CEP_CORREIOS environment variable is not defined');
    }

    const returnCEP: ReturnCepExternal = await this.httpService.axiosRef.get<ReturnCepExternal>(this.URL_CORREIOS.replace('{CEP}', cep))
        .then((result)=> {
            
            if(result.data.erro){
                throw new NotFoundException("CEP not found")
            }
            return result.data
        }).catch((error: AxiosError)=> {
            throw new BadRequestException(`Error in connection request ${error}`)
        }) 


    const city: CityEntity | undefined = await this.cityService
      .findCityByName(returnCEP.localidade, returnCEP.uf)
      .catch(() => undefined);

    console.log(city)

    return new ReturnCep(returnCEP, city?.id, city?.state?.id)
   
  }
}
