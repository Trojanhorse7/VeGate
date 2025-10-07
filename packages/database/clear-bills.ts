import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearBills() {
  try {
    const result = await prisma.bill.deleteMany({});
    console.log(`✅ Deleted ${result.count} bills from database`);
  } catch (error) {
    console.error('❌ Failed to clear bills:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearBills();
