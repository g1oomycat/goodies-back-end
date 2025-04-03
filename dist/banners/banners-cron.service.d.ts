import { PrismaService } from 'src/prisma.service';
export declare class BannerCronService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    updateBannerStatus(): Promise<void>;
}
