import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('🗑️  Clearing database...\n');
    
    // Delete in correct order (foreign keys)
    const payments = await prisma.payment.deleteMany({});
    console.log(`✅ Deleted ${payments.count} payments`);
    
    const bridges = await prisma.bridgeTransaction.deleteMany({});
    console.log(`✅ Deleted ${bridges.count} bridge transactions`);
    
    const bills = await prisma.bill.deleteMany({});
    console.log(`✅ Deleted ${bills.count} bills`);
    
    const users = await prisma.user.deleteMany({});
    console.log(`✅ Deleted ${users.count} users`);
    
    console.log('\n✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
