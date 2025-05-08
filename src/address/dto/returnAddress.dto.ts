import { IsInt, IsString } from "class-validator";
import { AddressEntity } from "../entities/address.entity";
import { ReturnCityDto } from "src/city/dto/returnCity.dto";


export class ReturnAddressDto {
 
    complement: string; 
    numberAddress: number;
    cep: string; 
    city?: ReturnCityDto;

    constructor(addressEntity: AddressEntity){
        this.complement = addressEntity.complement;
        this.numberAddress = addressEntity.numberAddress;
        this.cep = addressEntity.cep; 
        this.city = addressEntity.city ? new ReturnCityDto(addressEntity.city): undefined;
    }
}