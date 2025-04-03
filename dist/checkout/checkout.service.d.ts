import { PrismaService } from 'src/prisma.service';
export declare class CheckoutService {
    private prisma;
    constructor(prisma: PrismaService);
    getOne(uniqValue: string, identifier: 'id' | 'userId'): Promise<{
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
    getCheckout(userId: string, includeProduct?: boolean): Promise<{
        totalQuantity: number;
        result: {
            orderItems: ({
                product: {
                    reviews: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        productId: string;
                        userId: string;
                        comment: string | null;
                        rating: number;
                    }[];
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
                    attributes: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        productId: string;
                        title: string;
                        value: string;
                        categoryAttributeId: string;
                    }[];
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
        };
    }>;
    createCheckout(userId: string): Promise<{
        totalQuantity: number;
        result: {
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
        };
    }>;
}
