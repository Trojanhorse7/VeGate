import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@vegate/database";
import { getBill as getOnChainBill } from "@vegate/sdk";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { billId: string } }
) {
  try {
    const { billId } = params;

    // Get from database
    const dbBill = await prisma.bill.findUnique({
      where: { billId },
      include: {
        payments: true,
        bridgeInfo: true,
      },
    });

    if (!dbBill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    // Get on-chain data for verification
    const onChainBill = await getOnChainBill(billId);

    return NextResponse.json({
      success: true,
      bill: {
        ...dbBill,
        onChain: onChainBill,
      },
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json(
      { error: "Failed to fetch bill" },
      { status: 500 }
    );
  }
}
