"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      // Wait for PayPal order capture to complete
      const order = await actions.order?.capture();
      console.log("PayPal Order Details:", order);

      // Log payment to PayPal capture API (non-blocking)
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

      // Call confirm-purchase API to add credits to user account
      const purchaseResponse = await fetch("/api/confirm-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planName: planName,
          amount: amount,
          orderId: order.id,
        }),
      });

      if (!purchaseResponse.ok) {
        const errorData = await purchaseResponse.json();
        throw new Error(errorData.error || "Failed to add credits");
      }

      const purchaseResult = await purchaseResponse.json();

      if (purchaseResult.success) {
        // Refresh the page to update credit balance in UI
        router.refresh();
        
        toast.success("Payment Successful!", {
          description: `Credits added! You now have ${purchaseResult.newBalance} credits.`,
        });
      } else {
        toast.error("Payment Error", {
          description: "Payment processed but there was an error adding credits. Please contact support.",
        });
      }
    } catch (error) {
      console.error("PayPal approval error:", error);
      toast.error("Payment Failed", {
        description: error instanceof Error ? error.message : "Please try again.",
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
            console.error("PayPal error:", err);
            toast.error("Payment Error", {
              description: "An error occurred. Please try again.",
            });
          }}
          onCancel={(data) => {
            console.log("Payment cancelled:", data);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
