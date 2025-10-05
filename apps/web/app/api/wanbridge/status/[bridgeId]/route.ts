import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@vegate/database";
import { getBridgeStatus } from "@vegate/sdk";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { bridgeId: string } }
) {
  try {
    const { bridgeId } = params;

    // Get status from WanBridge
    const status = await getBridgeStatus(bridgeId);

    // Update database
    await prisma.bridgeTransaction.update({
      where: { bridgeId },
      data: {
        status: status.status,
        sourceTxHash: status.sourceTxHash || undefined,
        completedAt: status.status === "completed" ? new Date() : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error("Error fetching bridge status:", error);
    return NextResponse.json(
      { error: "Failed to fetch bridge status" },
      { status: 500 }
    );
  }
}
