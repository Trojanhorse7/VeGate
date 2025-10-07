import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@vegate/database";

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

    // Return database data
    // On-chain data fetching should be done client-side
    return NextResponse.json({
      success: true,
      bill: dbBill,
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json(
      { error: "Failed to fetch bill" },
      { status: 500 }
    );
  }
}
