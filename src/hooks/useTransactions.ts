import { useEffect, useState } from "react";
import http from "@/api/axiosInstance";
import { useOnboardingStatus } from "./useOnboardingStatus";

export type Transaction = {
  trax_id: string;
  api_name: string;
  status: string;
  timestamp: string;
  turn_around_time?: string | null;
};

type TransactionApiResponse = Omit<Transaction, "trax_id"> & {
  trax_id: string | number;
};

// Example good mock data
const MOCK_TRANSACTIONS: Transaction[] = [];

export function useTransactions(search?: string) {
  const { data: onboardingStatus } = useOnboardingStatus();
  const isProduction = Boolean(onboardingStatus?.is_onboarded);
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);

        if (!isProduction) {
          // Use mock data if not onboarded
          if (!cancelled) {
            setData(MOCK_TRANSACTIONS);
            setLoading(false);
          }
          return;
        }

        // Fetch transactions with optional backend search
        const { data } = await http.get<TransactionApiResponse[]>("/usage/", {
          params: search ? { search } : undefined,
        });

        if (!cancelled) {
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
  }, [isProduction, search]);

  return { data, loading, error };
}
