import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, planName, amount, orderDetails } = body;

    console.log("Adding credits for user:", userId);
    console.log("Order ID:", orderId);
    console.log("Plan:", planName);
    console.log("Amount:", amount);
    console.log("Order Details:", JSON.stringify(orderDetails, null, 2));

    // TODO: Add database logic here to:
    // 1. Verify the payment with PayPal
    // 2. Add credits to user's account
    // 3. Record the transaction

    return NextResponse.json({ 
      success: true,
      message: "Credits added successfully",
      orderId,
      planName,
      amount,
    });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
