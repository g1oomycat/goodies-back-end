import { OrderDeliveryMethod, OrderPaymentMethod, OrderStatus } from '@prisma/client';
import { IParamsSort } from 'src/common/types/sort';
import { CreateOrderByAdminDto } from './dto/order/create-order-by-admin.dto';
import { UpdateOrderByAdminDto } from './dto/order/update-order-by-admin.dto';
import { OrdersService } from './orders.service';
import { ISortOrders } from './types/sort';
export declare class AdminOrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    getAll(sortBy?: ISortOrders, sort?: IParamsSort, userId?: string, publicId?: string, email?: string, phone?: string, deliveryMethod?: OrderDeliveryMethod, paymentMethod?: OrderPaymentMethod, status?: OrderStatus, limit?: string, page?: string): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        totalResult: number;
        result: ({
            userInfo: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
            };
            orderItems: ({
                product: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    discount: number;
                    slug: string;
                    description: string;
                    images: string[];
                    stock: number;
                    purchaseCount: number;
                    ordersCount: number;
                    price: number;
                    oldPrice: number | null;
                    percentageChange: number | null;
                    updatedPriceAt: Date | null;
                    categoryId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                quantity: number;
                discount: number | null;
                orderId: string;
                totalDiscount: number | null;
                unitPrice: number | null;
                totalPrice: number | null;
                originalPrice: number | null;
                totalOriginalPrice: number | null;
            })[];
        } & {
            id: string;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            userId: string | null;
            publicId: string;
            total: number;
            discount: number;
            manualDiscount: number;
            percentDiscount: number;
            originalTotal: number;
            type: import(".prisma/client").$Enums.OrderType;
            status: import(".prisma/client").$Enums.OrderStatus | null;
            completed: boolean;
            completedDate: Date | null;
            expectedDate: Date | null;
            comment: string | null;
            deliveryMethod: import(".prisma/client").$Enums.OrderDeliveryMethod | null;
            paymentMethod: import(".prisma/client").$Enums.OrderPaymentMethod | null;
            userInfoId: string | null;
        })[];
    }>;
    getOne(id: string): Promise<{
        orderStatusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            changedAt: Date;
        }[];
        userInfo: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
        };
        orderItems: ({
            product: {
                category: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    description: string;
                    image: string;
                    numberSort: number;
                };
            } & {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                discount: number;
                slug: string;
                description: string;
                images: string[];
                stock: number;
                purchaseCount: number;
                ordersCount: number;
                price: number;
                oldPrice: number | null;
                percentageChange: number | null;
                updatedPriceAt: Date | null;
                categoryId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            discount: number | null;
            orderId: string;
            totalDiscount: number | null;
            unitPrice: number | null;
            totalPrice: number | null;
            originalPrice: number | null;
            totalOriginalPrice: number | null;
        })[];
    } & {
        id: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        userId: string | null;
        publicId: string;
        total: number;
        discount: number;
        manualDiscount: number;
        percentDiscount: number;
        originalTotal: number;
        type: import(".prisma/client").$Enums.OrderType;
        status: import(".prisma/client").$Enums.OrderStatus | null;
        completed: boolean;
        completedDate: Date | null;
        expectedDate: Date | null;
        comment: string | null;
        deliveryMethod: import(".prisma/client").$Enums.OrderDeliveryMethod | null;
        paymentMethod: import(".prisma/client").$Enums.OrderPaymentMethod | null;
        userInfoId: string | null;
    }>;
    create(dto: CreateOrderByAdminDto): Promise<{
        orderItems: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                discount: number;
                slug: string;
                description: string;
                images: string[];
                stock: number;
                purchaseCount: number;
                ordersCount: number;
                price: number;
                oldPrice: number | null;
                percentageChange: number | null;
                updatedPriceAt: Date | null;
                categoryId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            discount: number | null;
            orderId: string;
            totalDiscount: number | null;
            unitPrice: number | null;
            totalPrice: number | null;
            originalPrice: number | null;
            totalOriginalPrice: number | null;
        })[];
        userInfo: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
        };
        id: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        userId: string | null;
        publicId: string;
        total: number;
        discount: number;
        manualDiscount: number;
        percentDiscount: number;
        originalTotal: number;
        type: import(".prisma/client").$Enums.OrderType;
        status: import(".prisma/client").$Enums.OrderStatus | null;
        completed: boolean;
        completedDate: Date | null;
        expectedDate: Date | null;
        comment: string | null;
        deliveryMethod: import(".prisma/client").$Enums.OrderDeliveryMethod | null;
        paymentMethod: import(".prisma/client").$Enums.OrderPaymentMethod | null;
        userInfoId: string | null;
    }>;
    update(dto: UpdateOrderByAdminDto, id: string): Promise<{
        userInfo: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
        };
        orderItems: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                discount: number;
                slug: string;
                description: string;
                images: string[];
                stock: number;
                purchaseCount: number;
                ordersCount: number;
                price: number;
                oldPrice: number | null;
                percentageChange: number | null;
                updatedPriceAt: Date | null;
                categoryId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            discount: number | null;
            orderId: string;
            totalDiscount: number | null;
            unitPrice: number | null;
            totalPrice: number | null;
            originalPrice: number | null;
            totalOriginalPrice: number | null;
        })[];
    } & {
        id: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        userId: string | null;
        publicId: string;
        total: number;
        discount: number;
        manualDiscount: number;
        percentDiscount: number;
        originalTotal: number;
        type: import(".prisma/client").$Enums.OrderType;
        status: import(".prisma/client").$Enums.OrderStatus | null;
        completed: boolean;
        completedDate: Date | null;
        expectedDate: Date | null;
        comment: string | null;
        deliveryMethod: import(".prisma/client").$Enums.OrderDeliveryMethod | null;
        paymentMethod: import(".prisma/client").$Enums.OrderPaymentMethod | null;
        userInfoId: string | null;
    }>;
}
