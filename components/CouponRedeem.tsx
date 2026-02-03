"use client";

import { useState } from "react";
import { Gift, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CouponRedeem() {
  const [code, setCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setMessage({ type: "error", text: "Please enter a coupon code" });
      return;
    }

    setIsRedeeming(true);
    setMessage(null);

    try {
      const response = await fetch("/api/redeem-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Coupon Redeemed!", {
          description: `${data.message} You now have ${data.totalCredits} credits!`,
        });
        setCode(""); // Clear input on success
        setMessage(null); // Clear message state
      } else {
        toast.error("Invalid Coupon", {
          description: data.error || "Failed to redeem coupon. Please try again.",
        });
        setMessage({
          type: "error",
          text: data.error || "Failed to redeem coupon. Please try again.",
        });
      }
    } catch (error) {
      console.error("Coupon redeem error:", error);
      toast.error("Error", {
        description: "An error occurred. Please try again.",
      });
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Gift className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-900">Redeem Promo Code</h3>
      </div>
      
      <form onSubmit={handleRedeem} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setMessage(null); // Clear message when typing
            }}
            placeholder="Enter promo code (e.g., LAUNCH2024)"
            className="flex-1 px-4 py-2.5 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium"
            disabled={isRedeeming}
          />
          <button
            type="submit"
            disabled={isRedeeming || !code.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {isRedeeming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Gift className="w-4 h-4" />
                Apply
              </>
            )}
          </button>
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </form>

      <p className="text-xs text-slate-500">
        Have a promo code? Enter it above to get free credits!
      </p>
    </div>
  );
}
