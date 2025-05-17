import { IsInt, IsString } from "class-validator";
import { AddressEntity } from "../entities/address.entity";
import { ReturnCityDto } from "../../city/dto/returnCity.dto";


export class ReturnAddressDto {
    
    id: number;
    complement: string; 
    numberAddress: number;
    cep: string; 
    city?: ReturnCityDto;

    constructor(addressEntity: AddressEntity){
        this.id = addressEntity.id;
        this.complement = addressEntity.complement;
        this.numberAddress = addressEntity.numberAddress;
        this.cep = addressEntity.cep; 
        this.city = addressEntity.city ? new ReturnCityDto(addressEntity.city): undefined;
    }
}