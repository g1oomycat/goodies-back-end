import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { CheckoutService } from './checkout.service';

@Auth()
@UsePipes(new ValidationPipe())
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get()
  async getCheckout(@CurrentUser('id') userId: string) {
    return this.checkoutService.getCheckout(userId);
  }

  // @Delete('delete-product')
  // async deleteProduct(@CurrentUser('id') userId: string) {
  //   return this.checkoutService.deleteCheckout(userId);
  // }
}
