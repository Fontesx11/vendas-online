import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateAddressDto } from './dto/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { UserService } from '../user/user.service';
import { CityService } from '../city/city.service';
import { Roles } from '../decorators/roles.decorator';
import { TypeUser } from '../user/enum/user-type.enum';
import { UserId } from '../decorators/user-id.decorator';

@Controller('address')
export class AddressController {

    constructor(
        private readonly addressService: AddressService,
        private readonly userService: UserService,
        private readonly cityService: CityService,
    ) {}

    @Roles(TypeUser.User)
    @Post()
    @UsePipes(ValidationPipe)
    async createAddress(@UserId() userId: number, @Body() createAddressDto: CreateAddressDto): Promise<AddressEntity>{

        await this.userService.findUserById(userId);
        await this.cityService.findCityById(createAddressDto.cityId);

        return this.addressService.createAddress(createAddressDto, userId)
    }


}
