/**
 * Unyt Mart POS - External Integrations Hub
 *
 * This module is designed for plugging in external APIs (Courier, SMS, Payment Gateway).
 * When API endpoints and keys are provided, configure them in .env and invoke these functions.
 */

// Environment-configured API credentials
export const INTEGRATION_CONFIG = {
  courier: {
    apiUrl: import.meta.env.VITE_COURIER_API_URL || "",
    apiKey: import.meta.env.VITE_COURIER_API_KEY || "",
    provider: "custom", // e.g., Domex, Prompt, Koombiyo, Fardar
  },
  sms: {
    apiUrl: import.meta.env.VITE_SMS_API_URL || "",
    apiKey: import.meta.env.VITE_SMS_API_KEY || "",
    senderId: "UNYTMART",
  },
  paymentGateway: {
    apiUrl: import.meta.env.VITE_PAYMENT_GATEWAY_URL || "",
    apiKey: import.meta.env.VITE_PAYMENT_GATEWAY_KEY || "",
    merchantId: "",
  },
};

/**
 * 1. Courier Service Integration (Create Waybill / Dispatch order)
 * Ready to receive API link and keys.
 */
export const dispatchToCourier = async (sale) => {
  if (!INTEGRATION_CONFIG.courier.apiUrl) {
    console.info(
      "[Integration: Courier] Ready for API endpoint. Simulating courier registration for order:",
      sale.id
    );
    return {
      success: true,
      simulated: true,
      trackingNumber: sale.customer?.tracking || `TRK-${Date.now().toString().slice(-8)}`,
      status: "READY_FOR_API",
    };
  }

  try {
    const payload = {
      orderId: sale.id,
      customerName: sale.customer?.name,
      customerPhone: sale.customer?.phone,
      deliveryAddress: sale.customer?.address,
      codAmount: sale.paymentMethod === "COD" ? sale.total : 0,
      itemCount: sale.items?.length || 1,
    };

    const response = await fetch(INTEGRATION_CONFIG.courier.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${INTEGRATION_CONFIG.courier.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("[Integration: Courier] Error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * 2. SMS Gateway Integration (Send Order Confirmation SMS)
 */
export const sendOrderNotificationSMS = async (sale, messageText) => {
  if (!INTEGRATION_CONFIG.sms.apiUrl) {
    console.info("[Integration: SMS] Ready for API endpoint. Pending SMS for:", sale.customer?.phone);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(INTEGRATION_CONFIG.sms.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${INTEGRATION_CONFIG.sms.apiKey}`,
      },
      body: JSON.stringify({
        to: sale.customer?.phone,
        message: messageText || `Your order ${sale.id} has been placed successfully with Unyt Mart. Total: Rs. ${sale.total}`,
      }),
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("[Integration: SMS] Error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * 3. Online Payment Gateway Integration
 */
export const initiatePaymentGateway = async (sale) => {
  if (!INTEGRATION_CONFIG.paymentGateway.apiUrl) {
    console.info("[Integration: Payment] Ready for API endpoint.");
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(INTEGRATION_CONFIG.paymentGateway.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${INTEGRATION_CONFIG.paymentGateway.apiKey}`,
      },
      body: JSON.stringify({
        amount: sale.total,
        orderId: sale.id,
        customerEmail: sale.customer?.email,
      }),
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("[Integration: Payment] Error:", error);
    return { success: false, error: error.message };
  }
};

