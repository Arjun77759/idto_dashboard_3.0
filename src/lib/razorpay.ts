// Razorpay integration utility
// Loads Razorpay checkout script and provides payment functionality

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount?: string; // Amount in paise (e.g., 50000 = ₹500) - Optional when using order_id
  currency?: string;
  name?: string;
  description?: string;
  image?: string; // URL of the image to be displayed on the checkout
  order_id?: string; // When using order_id, amount is not required as it's in the order
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color?: string;
  };
  handler?: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
  };
  onError?: (error: any) => void;
}

let razorpayLoaded = false;
let razorpayLoading = false;

/**
 * Load Razorpay checkout script dynamically
 */
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    if (razorpayLoading) {
      // Wait for existing load to complete
      const checkInterval = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    razorpayLoading = true;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      razorpayLoaded = true;
      razorpayLoading = false;
      resolve();
    };
    script.onerror = () => {
      razorpayLoading = false;
      reject(new Error('Failed to load Razorpay checkout script'));
    };
    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay checkout
 */
export const openRazorpayCheckout = async (
  options: RazorpayOptions
): Promise<void> => {
  try {
    await loadRazorpayScript();

    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    // Build Razorpay options object matching the reference pattern
    const razorpayOptions: any = {
      key: options.key,
      currency: options.currency || 'INR',
      name: options.name || 'IDto',
      description: options.description || 'Payment',
      handler: (response: any) => {
        if (options.handler) {
          options.handler(response);
        }
      },
    };

    // Add optional fields only if provided
    if (options.amount !== undefined) {
      razorpayOptions.amount = options.amount;
    }
    if (options.order_id) {
      razorpayOptions.order_id = options.order_id;
    }
    if (options.image) {
      razorpayOptions.image = options.image;
    }
    if (options.prefill) {
      razorpayOptions.prefill = options.prefill;
    }
    if (options.notes) {
      razorpayOptions.notes = options.notes;
    }
    if (options.theme) {
      razorpayOptions.theme = options.theme;
    }
    if (options.modal) {
      razorpayOptions.modal = {
        ondismiss: () => {
          if (options.modal?.ondismiss) {
            options.modal.ondismiss();
          }
        },
      };
    }

    const razorpay = new window.Razorpay(razorpayOptions);

    // Handle payment failures - matching reference pattern
    if (options.onError) {
      razorpay.on('payment.failed', (error: any) => {
        options.onError?.(error);
      });
    }

    razorpay.open();
  } catch (error) {
    console.error('Error opening Razorpay checkout:', error);
    throw error;
  }
};

/**
 * Get Razorpay key from environment
 */
export const getRazorpayKey = (): string => {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!key) {
    throw new Error('Razorpay Key ID not configured. Please set VITE_RAZORPAY_KEY_ID');
  }
  return key;
};

