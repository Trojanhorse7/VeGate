import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@vegate/database";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { billId: string } }
) {
  try {
    const { billId } = params;
    const body = await req.json();
    const { payer, txHash, b3trReward } = body;

    if (!payer || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update bill status
    const bill = await prisma.bill.update({
      where: { billId },
      data: {
        paid: true,
        paidBy: payer,
        payer,
        txHash,
        b3trReward: b3trReward || "0",
        paidAt: new Date(),
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        billId: bill.id,
        payer,
        txHash,
        amount: bill.amount,
        token: bill.token,
        b3trReward: b3trReward || "0",
      },
    });

    // Update user stats - fetch and manually calculate rewards
    const existingUser = await prisma.user.findUnique({
      where: { wallet: payer },
    });
    
    let newRewards = b3trReward || "0";
    if (existingUser && existingUser.totalRewards) {
      newRewards = (BigInt(existingUser.totalRewards) + BigInt(b3trReward || "0")).toString();
    }

    await prisma.user.upsert({
      where: { wallet: payer },
      update: {
        billsPaid: { increment: 1 },
        totalRewards: newRewards,
        socialImpactBills: bill.socialImpact 
          ? { increment: 1 } 
          : undefined,
        lastActive: new Date(),
      },
      create: {
        wallet: payer,
        billsPaid: 1,
        totalRewards: b3trReward || "0",
        socialImpactBills: bill.socialImpact ? 1 : 0,
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        billId: bill.billId,
        txHash,
        b3trReward,
      },
    });
  } catch (error: any) {
    console.error("Error processing payment:", error);
    
    // Log detailed error for debugging
    if (error.code === 'P2025') {
      console.error("Bill not found:", params.billId);
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to process payment" },
      { status: 500 }
    );
  }
}
