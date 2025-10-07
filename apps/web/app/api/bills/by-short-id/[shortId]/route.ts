import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@vegate/database";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const { shortId } = params;

    if (!shortId) {
      return NextResponse.json(
        { error: "Short bill ID is required" },
        { status: 400 }
      );
    }

    // Look up bill by short ID
    const bill = await prisma.bill.findUnique({
      where: { shortBillId: shortId },
    });

    if (!bill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ bill }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bill by short ID:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
