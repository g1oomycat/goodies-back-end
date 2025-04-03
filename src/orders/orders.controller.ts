import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';

import { OrderStatus } from '@prisma/client';
import { IParamsSort } from 'src/common/types/sort';

import { CreateOrderDto } from './dto/order/create-order.dto';
import { OrdersService } from './orders.service';
import { ISortOrders } from './types/sort';

@Auth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAll(
    @CurrentUser('id') id: string,
    @Query('status') status?: OrderStatus,
    @Query('sortBy') sortBy: ISortOrders = 'createdAt',
    @Query('sort') sort: IParamsSort = 'desc',
    @Query('limit') limit: string = '20',
    @Query('page') page: string = '1',
  ) {
    return this.ordersService.getAll(
      id,
      status,
      status,
      sortBy,
      sort,
      Number(limit),
      Number(page),
    );
  }

  @Get(':publicId')
  async getOne(
    @CurrentUser('id') id: string,
    @Param('publicId') publicId: string,
  ) {
    return this.ordersService.getOne(publicId, 'publicId', true, id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.createByUser(dto, userId);
  }
}
