import http from "@/api/axiosInstance";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useEffect, useState } from "react";

export type InvoiceItem = {
  id: string;
  date_time: string;
  status: "Paid" | string;
  amount: string;
};

// Generate 'good' mock recent invoice data
function getMockRecentInvoices(limit: number = 4): InvoiceItem[] {
  const now = new Date();
  let list: InvoiceItem[] = [];
  for (let i = 0; i < limit; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i * 7); // each invoice a week apart
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const hour = `${("0" + d.getHours()).slice(-2)}`;
    const minute = `${("0" + d.getMinutes()).slice(-2)}`;
    const second = `${("0" + d.getSeconds()).slice(-2)}`;
    const date_time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  return list;
}

export function useRecentInvoices(limit: number = 4) {
  const { data: onboardingStatus } = useOnboardingStatus();
  const isProduction = Boolean(onboardingStatus?.is_onboarded);

  const [data, setData] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchRecent() {
      setLoading(true);
      setError(null);
      // Validate limit range (1-50)
      const validLimit = Math.max(1, Math.min(50, limit));

      if (!isProduction) {
        // Use mock invoices for non-production
        const mockInvoices = getMockRecentInvoices(validLimit);
        if (!cancelled) {
          setData(mockInvoices);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        const response = await http.get<InvoiceItem[]>("/me/invoices/recent", {
          params: { limit: validLimit },
        });

        if (!cancelled) setData(response.data);
      } catch (e: any) {
        if (!cancelled) {
          // Handle different error response structures
          let errorMessage = "Failed to load invoices";
          if (e?.response?.data?.detail) {
            const detail = e.response.data.detail;
            if (Array.isArray(detail)) {
              errorMessage = detail
                .map((err: any) => err.msg || JSON.stringify(err))
                .join(", ");
            } else if (typeof detail === "object" && detail.msg) {
              errorMessage = detail.msg;
            } else if (typeof detail === "string") {
              errorMessage = detail;
            } else if (typeof detail === "object") {
              errorMessage = JSON.stringify(detail);
            }
          } else if (e?.message) {
            errorMessage = e.message;
          }
          setError(errorMessage);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRecent();
    return () => {
      cancelled = true;
    };
  }, [limit, isProduction]);

  return { data, loading, error };
}
