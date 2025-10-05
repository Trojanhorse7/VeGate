import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@vegate/database";
import { generateQR } from "@vegate/sdk";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { billId, receiver, token, amount, socialImpact, category, createdBy } = body;

    // Validate input
    if (!billId || !receiver || !token || !amount || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrCodeUrl = await generateQR(billId);

    // Save to database
    const bill = await prisma.bill.create({
      data: {
        billId,
        receiver,
        token,
        amount: amount.toString(),
        socialImpact: socialImpact || false,
        category: category || "E-commerce",
        createdBy,
        qrCodeUrl,
        qrCodeData: qrCodeUrl,
      },
    });

    // Update user stats
    await prisma.user.upsert({
      where: { wallet: createdBy },
      update: {
        billsCreated: { increment: 1 },
        lastActive: new Date(),
      },
      create: {
        wallet: createdBy,
        billsCreated: 1,
      },
    });

    return NextResponse.json({
      success: true,
      bill: {
        id: bill.id,
        billId: bill.billId,
        qrCodeUrl: bill.qrCodeUrl,
      },
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    );
  }
}
