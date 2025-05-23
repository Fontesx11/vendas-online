import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDto } from './dto/insert-cart.dto';
import { CartProductService } from '../cart-product/cart-product.service';
import { UpdateCartDto } from './dto/update-cart.dto';

const LINE_AFFECTED = 1;

@Injectable()
export class CartService {

    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        private readonly cartProductService: CartProductService
    ) {}

    async findCartByUserId(userId: number, isRelations?: boolean):  Promise<CartEntity>{

        const relations = isRelations ? {
            cartProduct:{
                product: true,
            } 
        }: undefined;


        const cart = await this.cartRepository.findOne({
            where:{
              userId,  
              active: true,
            },
            relations,
        })

        if(!cart){
            throw new NotFoundException("Active cart not found")
        }

        return cart;
    }

    async createCart(userId: number): Promise<CartEntity>{
        return this.cartRepository.save({
            active: true,
            userId,
        })
    }

    async insertProductInCart( insertCartDto: InsertCartDto, userId: number): Promise<CartEntity>{
        
        const cart =  await this.findCartByUserId(userId).catch(async () => {
            return this.createCart(userId);
        });

        await this.cartProductService.insertProductInCart(insertCartDto, cart);

        return cart;
    }

     async updateProductAmountInCart( updateCartDto: UpdateCartDto, userId: number): Promise<CartEntity>{
        
        const cart =  await this.findCartByUserId(userId).catch(async () => {
            return this.createCart(userId);
        });

        await this.cartProductService.updateProductAmountInCart(cart, updateCartDto);

        return cart;
    }

    async clearCart(userId: number):Promise<DeleteResult>{
        const cart = await this.findCartByUserId(userId);

        await this.cartRepository.save({
            ...cart,
            active: false,
        });

        return {
            raw:[],
            affected: LINE_AFFECTED,
        }
    }

    async deleteProductInCart(productId: number, userId: number): Promise<DeleteResult>{
        const cart = await this.findCartByUserId(userId)

        return await this.cartProductService.deleteProductInCart(productId, cart.id)
    }
    

}
