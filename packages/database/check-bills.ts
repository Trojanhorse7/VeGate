import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBills() {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        billId: true,
        amount: true,
        token: true,
        paid: true,
        createdAt: true,
      }
    });
    
    console.log('\n📋 Last 5 Bills in Database:');
    console.log('================================');
    
    if (bills.length === 0) {
      console.log('✅ No bills found - database is clean');
    } else {
      bills.forEach((bill, index) => {
        console.log(`\n${index + 1}. Bill ID: ${bill.billId.slice(0, 20)}...`);
        console.log(`   Amount: ${bill.amount}`);
        console.log(`   Token: ${bill.token}`);
        console.log(`   Paid: ${bill.paid}`);
        console.log(`   Created: ${bill.createdAt}`);
        
        // Check if amount is in wei format (should be > 17 digits for 1 VET)
        const isWeiFormat = bill.amount.length >= 18;
        console.log(`   Format: ${isWeiFormat ? '✅ Wei (correct)' : '❌ Decimal (incorrect)'}`);
      });
      
      console.log('\n================================');
      console.log(`Total bills: ${bills.length}`);
    }
  } catch (error) {
    console.error('❌ Failed to check bills:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBills();
