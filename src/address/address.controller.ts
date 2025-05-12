import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateAddressDto } from './dto/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { UserService } from '../user/user.service';
import { CityService } from '../city/city.service';
import { Roles } from '../decorators/roles.decorator';
import { TypeUser } from '../user/enum/user-type.enum';
import { UserId } from '../decorators/user-id.decorator';
import { ReturnAddressDto } from './dto/returnAddress.dto';

@Roles(TypeUser.User, TypeUser.Admin)
@Controller('address')
export class AddressController {

    constructor(
        private readonly addressService: AddressService,
        private readonly userService: UserService,
        private readonly cityService: CityService,
    ) {}

  
    @Post()
    @UsePipes(ValidationPipe)
    async createAddress(@UserId() userId: number, @Body() createAddressDto: CreateAddressDto): Promise<AddressEntity>{

        await this.userService.findUserById(userId);
        await this.cityService.findCityById(createAddressDto.cityId);

        return this.addressService.createAddress(createAddressDto, userId)
    }

    @Get()
    async findAddressByUserId(@UserId() userId: number): Promise<ReturnAddressDto[]> {
        return (await this.addressService.findAddressByUserId(userId)).map((address)=>new ReturnAddressDto(address));
    }


}
