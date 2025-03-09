import { PrismaClient } from '@prisma/client';

const PrismaClientSingleTon = () => {
  return new PrismaClient();
};
declare const prismaGlobal: {
  prisma: ReturnType<typeof PrismaClientSingleTon>;
} & typeof global;

const prisma = prismaGlobal.prisma ?? PrismaClientSingleTon();

if (process.env.NODE_ENV !== 'production') prismaGlobal.prisma = prisma;

export default prisma;
