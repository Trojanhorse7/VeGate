import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@vegate/database";
import { createBridgeTransaction } from "@vegate/sdk";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      billId,
      sourceChain,
      sourceToken,
      targetToken,
      amount,
      recipient,
      sourceAddress,
    } = body;

    if (!billId || !sourceChain || !sourceToken || !amount || !recipient || !sourceAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create bridge transaction
    const { bridgeId, txData } = await createBridgeTransaction({
      sourceChain,
      targetChain: "vechain",
      sourceToken,
      targetToken,
      amount,
      recipient,
      sourceAddress,
    });

    // Save bridge info to database
    const bill = await prisma.bill.findUnique({
      where: { billId },
    });

    if (bill) {
      await prisma.bridgeTransaction.create({
        data: {
          billId: bill.id,
          sourceChain,
          sourceToken,
          sourceAmount: amount,
          targetChain: "vechain",
          targetToken,
          bridgeId,
          status: "pending",
        },
      });
    }

    return NextResponse.json({
      success: true,
      bridgeId,
      txData,
    });
  } catch (error) {
    console.error("Error creating bridge transaction:", error);
    return NextResponse.json(
      { error: "Failed to create bridge transaction" },
      { status: 500 }
    );
  }
}
