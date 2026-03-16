import { useState } from "react";

interface CheckoutResult {
  qrCode: string;
  brCode: string;
  correlationID: string;
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (plan: "pro" | "teams") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Checkout failed");
      }
      const data = await res.json();
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, result, error, reset: () => { setResult(null); setError(null); } };
}
