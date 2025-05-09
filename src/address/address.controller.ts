import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateAddressDto } from './dto/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { UserService } from 'src/user/user.service';
import { CityService } from 'src/city/city.service';
import { Roles } from 'src/decorators/roles.decorator';
import { TypeUser } from 'src/user/enum/user-type.enum';

@Controller('address')
export class AddressController {

    constructor(
        private readonly addressService: AddressService,
        private readonly userService: UserService,
        private readonly cityService: CityService,
    ) {}

    @Roles(TypeUser.User)
    @Post('/:userId')
    @UsePipes(ValidationPipe)
    async createAddress(@Param('userId') userId: number, @Body() createAddressDto: CreateAddressDto): Promise<AddressEntity>{

        await this.userService.findUserById(userId);
        await this.cityService.findCityById(createAddressDto.cityId);

        return this.addressService.createAddress(createAddressDto, userId)
    }


}
