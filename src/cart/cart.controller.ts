import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/cart-item/create-cart-item.dto';
import { DeleteCartItemDto } from './dto/cart-item/delete-cart-item.dto';
import { UpdateCartItemDto } from './dto/cart-item/update-cart-item.dto';

@Auth()
@UsePipes(new ValidationPipe())
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add-product')
  async addProduct(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCartItemDto,
  ) {
    return this.cartService.addProduct(userId, dto);
  }
  @Put('update-product')
  async updateProduct(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateProduct(userId, dto);
  }
  @Post('delete-product')
  async deleteProduct(
    @CurrentUser('id') userId: string,
    @Body() dto: DeleteCartItemDto,
  ) {
    return this.cartService.deleteProduct(userId, dto);
  }
}
