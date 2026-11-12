import React, { useState, useEffect } from "react";
import { usePOS } from "../../context/POSContext";
import { sendWhatsAppReceipt } from "../../services/whatsappService";
import { dispatchToCourier, sendOrderNotificationSMS } from "../../services/integrations";
import { X, CheckCircle, Smartphone, Truck, Banknote, DollarSign } from "lucide-react";

export const PaymentModal = ({ isOpen, onClose }) => {
  const { cartTotal, settings, finalizeSale, printReceipt } = usePOS();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [courierTracking, setCourierTracking] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cashReceived, setCashReceived] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auto-calculated COD Amount
  const codAmountDisplay =
    paymentMethod === "COD"
      ? `${settings.currency} ${cartTotal.toFixed(2)}`
      : "0.00/=";

  // Auto-calculated Change
  const cashNum = parseFloat(cashReceived) || 0;
  const changeAmount = Math.max(0, cashNum - cartTotal);

  useEffect(() => {
    if (isOpen) {
      setCashReceived("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCompleteOrder = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const saleRecord = await finalizeSale({
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          address: customerAddress.trim(),
          tracking: courierTracking.trim(),
        },
        paymentMethod,
        cashReceived: cashNum,
      });

      // Reset local modal state
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCourierTracking("");
      setCashReceived("");
      onClose();

      // Trigger Integration services (Courier / SMS)
      dispatchToCourier(saleRecord);
      sendOrderNotificationSMS(saleRecord);

      // Prompt to send WhatsApp Web Receipt if phone exists
      if (saleRecord.customer?.phone) {
        if (
          window.confirm("Sale completed! Open WhatsApp Web to send the receipt now?")
        ) {
          sendWhatsAppReceipt(saleRecord, settings);
        }
      }

      // Automatically open print dialog
      printReceipt(saleRecord);
    } catch (err) {
      alert("Failed to finalize order: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkPanel border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[92vh] relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:hover:text-white p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Dispatch & Payment Details
        </h2>

        {/* Total Order Amount Box */}
        <div className="bg-emerald-50 dark:bg-gray-900/90 p-4 rounded-2xl mb-4 text-center border border-emerald-200 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Total Order Amount</p>
          <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
            {settings.currency} {cartTotal.toFixed(2)}
          </h3>
        </div>

        <form onSubmit={handleCompleteOrder} className="space-y-3.5">
          {/* Customer Name */}
          <div>
            <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Kasun Perera / Walk-in"
              className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs focus:border-primary focus:outline-none transition shadow-sm"
            />
          </div>

          {/* Customer Phone (WhatsApp) */}
          <div>
            <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
              WhatsApp Phone Number * (e.g. 0771234567 or +94771234567)
            </label>
            <div className="relative">
              <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+94766802925"
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 pl-9 text-gray-900 dark:text-white text-xs focus:border-primary focus:outline-none transition shadow-sm"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
              Delivery / Shipping Address *
            </label>
            <textarea
              required
              rows={2}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="House #, Street name, City, District"
              className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs focus:border-primary focus:outline-none transition resize-none shadow-sm"
            />
          </div>

          {/* Payment Method & Courier Tracking */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs focus:border-primary focus:outline-none transition shadow-sm"
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Bank Transfer">Bank Transfer / Paid</option>
                <option value="Cash">Cash Store Pickup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Courier / Tracking No.
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={courierTracking}
                  onChange={(e) => setCourierTracking(e.target.value)}
                  placeholder="e.g. Prompt / Domex #"
                  className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 pl-9 text-gray-900 dark:text-white text-xs focus:border-primary focus:outline-none transition shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* COD Amount Readonly */}
          <div>
            <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
              COD Amount to Collect
            </label>
            <input
              type="text"
              readOnly
              value={codAmountDisplay}
              className="w-full bg-gray-100 dark:bg-darkBg/60 border border-emerald-500/40 rounded-xl py-2 px-3 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm cursor-not-allowed shadow-sm"
            />
          </div>

          {/* Cash Received & Balance (For walk-in or immediate cash) */}
          <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                Cash Tendered (If paid in cash)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-sm font-bold font-mono focus:border-primary focus:outline-none shadow-sm"
              />
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Balance / Change to return:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-yellow-400 text-sm">
                {settings.currency} {changeAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs transition shadow-lg shadow-green-600/25 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Complete Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
