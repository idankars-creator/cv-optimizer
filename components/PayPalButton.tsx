"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface PayPalButtonProps {
  amount: number;
  planName: string;
}

export function PayPalButton({ amount, planName }: PayPalButtonProps) {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="w-full px-6 py-3 bg-gray-100 text-gray-500 font-semibold rounded-lg text-center">
        PayPal not configured
      </div>
    );
  }

  const handleApprove = async (data: any, actions: any) => {
    try {
      const order = await actions.order?.capture();
      console.log("PayPal Order Details:", order);

      // First, call PayPal capture API to log the payment (non-blocking)
      fetch("/api/paypal/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          planName,
          amount,
          orderDetails: order,
        }),
      }).catch(err => console.error("Failed to log payment:", err));

      // Then, call add-credits API to update database (this is critical)
      const creditsResponse = await fetch("/api/add-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planName,
          amount: amount,
          orderId: order.id,
        }),
      });

      if (!creditsResponse.ok) {
        const errorData = await creditsResponse.json();
        throw new Error(errorData.error || "Failed to add credits");
      }

      const creditsResult = await creditsResponse.json();

      if (creditsResult.success) {
        alert("Payment Successful! Credits have been added to your account.");
        router.push("/dashboard");
      } else {
        alert("Payment processed but there was an error adding credits. Please contact support.");
      }
    } catch (error) {
      console.error("PayPal approval error:", error);
      alert(`Payment processing failed: ${error instanceof Error ? error.message : "Please try again."}`);
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
            return actions.order.create({
              intent: "CAPTURE",
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
            console.error("PayPal error:", err);
            alert("Payment error occurred. Please try again.");
          }}
          onCancel={(data) => {
            console.log("Payment cancelled:", data);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
