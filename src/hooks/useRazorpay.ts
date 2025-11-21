import {
  confirmOrderFailed,
  confirmOrderSuccess,
  createOrder,
  type ConfirmOrderSuccessResponse,
  type CreateOrderRequest,
} from "@/api/paymentsApi";
import { invalidateMonthlyUsage } from "@/hooks/useMonthlyUsage";
import { getRazorpayKey, openRazorpayCheckout } from "@/lib/razorpay";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseRazorpayOptions {
  amount: number; // Amount in rupees (base amount before tax)
  tax?: number; // Tax amount in rupees (optional, defaults to 0)
  description?: string;
  image?: string; // URL of the image to be displayed on the checkout
  onSuccess?: (response: ConfirmOrderSuccessResponse) => void;
  onError?: (error: any) => void;
  onDismiss?: () => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  // Optional GST details
  gst_number?: string;
  company_name?: string;
  state?: string;
  address?: string;
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async (options: UseRazorpayOptions) => {
      if (loading) return;

      try {
        setLoading(true);

        // Calculate tax and total amount
        const tax = options.tax ?? 0;
        const totalAmount = options.amount + tax;

        // Convert to paise for Razorpay (expects amount in subunits)
        const amountInPaise = Math.round(totalAmount * 100);

        // Create order on backend
        const createOrderPayload: CreateOrderRequest = {
          amount: options.amount,
          tax: tax,
          total_amount: totalAmount,
          ...(options.gst_number && { gst_number: options.gst_number }),
          ...(options.company_name && { company_name: options.company_name }),
          ...(options.state && { state: options.state }),
          ...(options.address && { address: options.address }),
        };

        const orderResponse = await createOrder(createOrderPayload);
        const orderId = orderResponse.razorpay_response.id;
        setCurrentOrderId(orderId);

        // Open Razorpay checkout with order_id
        const razorpayKey = getRazorpayKey();

        await openRazorpayCheckout({
          key: razorpayKey,
          amount: amountInPaise.toString(), // Pass amount in paise as number
          currency: "INR",
          name: "IDto",
          description: options.description || "Account Recharge",
          image: options.image || "https://superadmin.idto.ai/Logo.png", // Use provided image or default logo
          order_id: orderId, // Use order_id from backend - this contains the amount
          prefill: options.prefill,
          notes: {
            ...options.notes,
            ...(options.address && { address: options.address }),
            ...(options.company_name && { company_name: options.company_name }),
          },
          theme: {
            color: "#0019ff", // Match your brand color
          },
          handler: async (response) => {
            try {
              // Confirm successful payment
              const confirmResponse = await confirmOrderSuccess({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

              setLoading(false);
              setCurrentOrderId(null);
              invalidateMonthlyUsage();
              toast.success("Payment successful!");

              if (options.onSuccess) {
                options.onSuccess(confirmResponse);
              }
            } catch (error: any) {
              setLoading(false);
              setCurrentOrderId(null);
              const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to confirm payment. Please contact support.";
              toast.error(errorMessage);
              if (options.onError) {
                options.onError(error);
              }
            }
          },
          onError: async (error: any) => {
            // Handle payment failure from Razorpay
            try {
              const errorPayload = {
                code: error.error?.code || error.code || "PAYMENT_FAILED",
                description:
                  error.error?.description ||
                  error.description ||
                  "Payment failed. Please try again.",
                source: error.error?.source || error.source || "gateway",
                step:
                  error.error?.step || error.step || "payment_authorization",
                reason: error.error?.reason || error.reason || "payment_failed",
                metadata: {
                  payment_id:
                    error.error?.metadata?.payment_id ||
                    error.metadata?.payment_id ||
                    "",
                  order_id:
                    error.error?.metadata?.order_id ||
                    error.metadata?.order_id ||
                    currentOrderId ||
                    "",
                },
              };

              await confirmOrderFailed(errorPayload);
              setLoading(false);
              setCurrentOrderId(null);
              invalidateMonthlyUsage();
              toast.error(errorPayload.description);
              if (options.onError) {
                options.onError(error);
              }
            } catch (confirmError) {
              console.error("Failed to confirm failed payment:", confirmError);
              setLoading(false);
              setCurrentOrderId(null);
              toast.error("Payment failed. Please try again.");
              if (options.onError) {
                options.onError(error);
              }
            }
          },
          modal: {
            ondismiss: async () => {
              // When user closes the modal without paying, we need to handle it
              // The backend expects an error object in this case
              if (currentOrderId) {
                try {
                  await confirmOrderFailed({
                    code: "USER_CLOSED",
                    description: "Payment was cancelled by user",
                    source: "user",
                    step: "payment_initiation",
                    reason: "payment_cancelled",
                    metadata: {
                      payment_id: "",
                      order_id: currentOrderId,
                    },
                  });
                  invalidateMonthlyUsage();
                } catch (error) {
                  console.error("Failed to confirm cancelled payment:", error);
                }
              }
              setLoading(false);
              setCurrentOrderId(null);
              if (options.onDismiss) {
                options.onDismiss();
              }
            },
          },
        });

        // Handle payment errors (when payment fails)
        // Note: Razorpay also has an on('payment.failed') event, but we'll handle it in the handler
        // For now, we'll catch errors in the handler itself
      } catch (error: any) {
        setLoading(false);
        setCurrentOrderId(null);
        const errorMessage =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to initiate payment. Please try again.";
        toast.error(errorMessage);
        if (options.onError) {
          options.onError(error);
        }
      }
    },
    [loading, currentOrderId]
  );

  return {
    initiatePayment,
    loading,
  };
};
