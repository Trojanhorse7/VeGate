import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@vegate/database";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const socialImpact = searchParams.get("socialImpact");

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    // Build query
    const where: any = {
      OR: [{ createdBy: wallet }, { paidBy: wallet }],
    };

    if (status) {
      where.paid = status === "paid";
    }

    if (category) {
      where.category = category;
    }

    if (socialImpact !== null) {
      where.socialImpact = socialImpact === "true";
    }

    // Fetch bills
    const bills = await prisma.bill.findMany({
      where,
      include: {
        payments: true,
        bridgeInfo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      history: bills,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment history" },
      { status: 500 }
    );
  }
}
