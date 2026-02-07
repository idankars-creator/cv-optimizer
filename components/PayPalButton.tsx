"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

interface PayPalButtonProps {
  amount: number;
  planName: string;
}

export function PayPalButton({ amount, planName }: PayPalButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="w-full px-6 py-3 bg-stone-100 text-stone-500 font-medium rounded-sm text-center tracking-wide">
        PayPal not configured
      </div>
    );
  }

  const handleApprove = async (data: any, actions: any) => {
    try {
      console.log("🟢 PayPal: Starting payment approval...");
      console.log("🟢 PayPal Order ID:", data.orderID);
      
      // 1. Capture payment
      const details = await actions.order?.capture();
      console.log("✅ PayPal Capture Success:", details);

      // 2. Add Credits via API
      console.log(`🔵 Calling /api/confirm-purchase with amount=${amount}, plan=${planName}`);
      
      const response = await fetch('/api/confirm-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: planName || "Credit Pack", 
          amount: amount, 
          orderId: data.orderID
        }),
      });

      console.log("📊 API Response status:", response.status);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("🔴 API Error Response:", errData);
        throw new Error(errData.error || "Failed to update credits");
      }

      const result = await response.json();
      console.log("✅ API Success Response:", result);
      
      // 3. Success UI
      toast.success(`Payment successful! +${result.added} credits added.`, {
        description: `New balance: ${result.newBalance} credits`,
        duration: 5000,
      });
      
      // Force reload to update UI state immediately
      setTimeout(() => {
        console.log("🔄 Reloading page to refresh credit balance...");
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      console.error("🔥 Payment Flow Error:", err);
      console.error("🔥 Error stack:", err.stack);
      
      toast.error("Payment completed, but credit update failed.", {
        description: "Please contact support if credits do not appear within 5 minutes.",
        duration: 10000,
      });
    }
  };

  return (
    <div className="relative z-0">
      <PayPalScriptProvider
        options={{
          clientId: clientId,
          currency: "USD",
          locale: "en_US",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={(data, actions) => {
            console.log("🟡 Creating PayPal order...");
            return actions.order.create({
              intent: "CAPTURE",
              application_context: {
                shipping_preference: "NO_SHIPPING", // Remove address form for digital goods
                user_action: "PAY_NOW",
                brand_name: "Hired CV",
              },
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: "USD",
                  },
                  description: planName,
                },
              ],
            });
          }}
          onApprove={handleApprove}
          onError={(err) => {
            console.error("🔴 PayPal SDK Error:", err);
            toast.error("Payment Error", {
              description: "An error occurred. Please try again.",
            });
          }}
          onCancel={(data) => {
            console.log("⚠️ Payment cancelled by user:", data);
            toast.info("Payment cancelled.");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}

export default PayPalButton;
