import { useEffect, useState } from "react";
import { getMonthlyUsage, type UsageMonthlyFilters } from "@/api/usageApi";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { getSandboxUsageMonthly } from "@/mocks/sandboxTransactions";

// Type for each monthly usage entry
export type UsageMonthlyItem = {
  api_name: string;
  number_of_transactions: number;
  unit_price: number;
  total_cost: number;
};

export function useUsageMonthly(filters?: UsageMonthlyFilters) {
  const { data: onboardingStatus } = useOnboardingStatus();
  const isProduction = Boolean(onboardingStatus?.is_onboarded);

  const [data, setData] = useState<UsageMonthlyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchMonthly() {
      setLoading(true);
      setError(null);
      try {
        if (!isProduction) {
          if (!cancelled) {
            setData(getSandboxUsageMonthly());
            setLoading(false);
            setError(null);
          }
          return;
        }
        // Real API fetch if production
        const response = await getMonthlyUsage(filters);
        // console.log('data usgae', response )
        if (!cancelled) setData(response);
      } catch (e: any) {
        if (!cancelled) {
          let errorMessage = "Failed to load monthly usage";
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
    fetchMonthly();
    return () => {
      cancelled = true;
    };
  }, [
    isProduction,
    filters?.start_date,
    filters?.end_date,
    filters?.region,
    filters?.api_name,
    filters?.device_type,
  ]);

  return { data, loading, error };
}
