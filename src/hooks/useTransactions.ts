import { useEffect, useState } from "react";
import http from "@/api/axiosInstance";

export type Transaction = {
  trax_id: string;
  api_name: string;
  request_details: string
  response_details: string
  response_message: string
  status: string;
  timestamp: string;
  turn_around_time?: string | null;
  final_price?: number | string | null;
};

type TransactionApiResponse = Omit<Transaction, "trax_id"> & {
  trax_id: string | number;
};

export function useTransactions(search?: string) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);

        // Fetch transactions with optional backend search
        const { data } = await http.get<TransactionApiResponse[]>("/usage/", {
          params: search ? { search } : undefined,
        });

        if (!cancelled) {
          // console.log("all transaction",data)
          setData(
            (data || []).map((transaction) => ({
              ...transaction,
              trax_id: String(transaction.trax_id),
            }))
          );
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || "Failed to fetch transactions");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTransactions();

    return () => {
      cancelled = true;
    };
  }, [search]);

  return { data, loading, error };
}
