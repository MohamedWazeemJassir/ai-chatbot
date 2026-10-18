import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Review } from '../generated/prisma/client';

export const reviewRepository = {
   async getReviews(productId: number): Promise<Review[]> {
      const prisma = new PrismaClient({
         adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      });
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
   },
};
