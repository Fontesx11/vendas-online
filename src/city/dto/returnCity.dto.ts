import { StateEntity } from "src/state/entities/state.entity";
import { CityEntity } from "../entities/city.entity";
import { ReturnStateDto } from "src/state/dto/returnState.dto";

export class ReturnCityDto{
     
    name: string;
    state?: ReturnStateDto;

    constructor(cityEntity: CityEntity){
        this.name = cityEntity.name;
        this.state = cityEntity.state ? new ReturnStateDto(cityEntity.state): undefined;
    }
}