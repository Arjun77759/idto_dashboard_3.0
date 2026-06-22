import http from "@/api/axiosInstance";
import { useEffect, useState } from "react";

export type InvoiceItem = {
  id: string;
  date_time: string;
  status: "Paid" | string;
  amount: string;
};

export function useRecentInvoices(limit: number = 4) {
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
  }, [limit]);

  return { data, loading, error };
}
