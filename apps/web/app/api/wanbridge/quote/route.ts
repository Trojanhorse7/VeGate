import { NextRequest, NextResponse } from "next/server";
import { getQuote } from "@vegate/sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceChain, sourceToken, targetToken, amount } = body;

    if (!sourceChain || !sourceToken || !targetToken || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const quote = await getQuote({
      sourceChain,
      targetChain: "vechain",
      sourceToken,
      targetToken,
      amount,
    });

    return NextResponse.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("Error getting quote:", error);
    return NextResponse.json(
      { error: "Failed to get bridge quote" },
      { status: 500 }
    );
  }
}
