import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OrderDeliveryMethod,
  OrderPaymentMethod,
  OrderStatus,
  UserRole,
} from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/users/decorators/roles.decorator';
import { RolesGuard } from 'src/users/guards/roles.guard';

import { IParamsSort } from 'src/common/types/sort';
import { CreateOrderByAdminDto } from './dto/order/create-order-by-admin.dto';
import { UpdateOrderByAdminDto } from './dto/order/update-order-by-admin.dto';
import { OrdersService } from './orders.service';
import { ISortOrders } from './types/sort';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Auth()
@UsePipes(new ValidationPipe())
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAll(
    @Query('sortBy') sortBy: ISortOrders = 'createdAt',
    @Query('sort') sort: IParamsSort = 'desc',
    @Query('userId') userId?: string,
    @Query('publicId') publicId?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('deliveryMethod') deliveryMethod?: OrderDeliveryMethod,
    @Query('paymentMethod') paymentMethod?: OrderPaymentMethod,
    @Query('status') status?: OrderStatus,
    @Query('limit') limit: string = '20',
    @Query('page') page: string = '1',
  ) {
    return this.ordersService.getAll(
      userId,
      publicId,
      status,
      sortBy,
      sort,
      Number(limit),
      Number(page),
      email,
      phone,
      deliveryMethod,
      paymentMethod,
    );
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.ordersService.getOne(id, 'id');
  }

  @HttpCode(200)
  @Post()
  async create(@Body() dto: CreateOrderByAdminDto) {
    return this.ordersService.createByAdmin(dto);
  }

  @HttpCode(200)
  @Put(':id')
  async update(@Body() dto: UpdateOrderByAdminDto, @Param('id') id: string) {
    return this.ordersService.updateOrder(dto, id);
  }

  // @HttpCode(200)
  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.ordersService.delete(id);
  // }
}
