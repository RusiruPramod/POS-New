import React from "react";
import { usePOS } from "../../context/POSContext";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export const Cart = ({ onOpenPayment }) => {
  const {
    cart,
    updateCartQty,
    clearCart,
    settings,
    cartDeliveryFee,
    setCartDeliveryFee,
    cartIsFreeDelivery,
    setCartIsFreeDelivery,
    cartShowDeliverySep,
    setCartShowDeliverySep,
    cartDiscount,
    setCartDiscount,
    cartSubtotal,
    cartTax,
    cartTotal,
  } = usePOS();

  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCancel = () => {
    if (cart.length === 0) return;
    if (window.confirm("Are you sure you want to clear the current cart?")) {
      clearCart();
    }
  };

  return (
    <div className="w-full md:w-96 glass rounded-2xl flex flex-col h-full border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden transition-colors">
      {/* Cart Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/80 dark:bg-gray-900/60">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">Current Order</h3>
        </div>
        <span className="bg-primary/10 text-primary border border-primary/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
          {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {cart.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 flex-col gap-2 py-12">
            <ShoppingBag className="w-12 h-12 opacity-30 stroke-[1.5]" />
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Cart is empty</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-[200px]">
              Select items from the products catalogue to start building an order
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 dark:bg-gray-900/80 p-3 rounded-xl flex justify-between items-center border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition shadow-sm"
            >
              <div className="flex-1 pr-2 min-w-0">
                <h5 className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                  {item.name}
                  {item.size && item.size !== "-" && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({item.size})
                    </span>
                  )}
                </h5>
                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {settings.currency} {Number(item.price).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/90 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => updateCartQty(item.id, -1)}
                  className="w-6 h-6 rounded bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 transition shadow-sm"
                  title="Decrease"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold font-mono px-1.5 min-w-[20px] text-center text-gray-900 dark:text-white">
                  {item.qty}
                </span>
                <button
                  onClick={() => updateCartQty(item.id, 1)}
                  className="w-6 h-6 rounded bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 transition shadow-sm"
                  title="Increase"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Actions */}
      <div className="p-4 bg-gray-50/90 dark:bg-gray-900/95 rounded-b-2xl border-t border-gray-200 dark:border-gray-800 space-y-2.5">
        {/* Subtotal */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Subtotal</span>
          <span className="font-mono text-gray-800 dark:text-gray-200 font-semibold">
            {settings.currency} {cartSubtotal.toFixed(2)}
          </span>
        </div>

        {/* Tax */}
        {Number(settings.tax) > 0 && (
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Tax ({settings.tax}%)</span>
            <span className="font-mono text-gray-800 dark:text-gray-200 font-semibold">
              {settings.currency} {cartTax.toFixed(2)}
            </span>
          </div>
        )}

        {/* Delivery Fee Section */}
        <div className="p-2.5 bg-white dark:bg-darkBg/90 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Delivery Fee
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">{settings.currency}</span>
              <input
                type="number"
                min="0"
                step="1"
                value={cartDeliveryFee}
                onChange={(e) => setCartDeliveryFee(e.target.value)}
                disabled={cartIsFreeDelivery}
                className="w-24 bg-gray-50 dark:bg-gray-900 border border-emerald-500/50 rounded-lg px-2 py-0.5 text-right text-emerald-600 dark:text-emerald-400 font-bold text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 pl-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              <input
                type="checkbox"
                checked={cartIsFreeDelivery}
                onChange={(e) => setCartIsFreeDelivery(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-primary bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
              Free Delivery (Waive fee)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              <input
                type="checkbox"
                checked={cartShowDeliverySep}
                onChange={(e) => setCartShowDeliverySep(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-primary bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
              Show delivery charge separately on receipt
            </label>
          </div>
        </div>

        {/* Discount */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Discount ({settings.currency})</span>
          <input
            type="number"
            min="0"
            step="1"
            value={cartDiscount}
            onChange={(e) => setCartDiscount(e.target.value)}
            className="w-24 bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-0.5 text-right text-gray-900 dark:text-white font-mono text-xs focus:outline-none focus:border-primary shadow-sm"
          />
        </div>

        {/* Grand Total */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-baseline">
          <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Total</span>
          <span className="font-black text-xl text-emerald-600 dark:text-emerald-400 font-mono">
            {settings.currency} {cartTotal.toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCancel}
            disabled={cart.length === 0}
            className="flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            onClick={onOpenPayment}
            disabled={cart.length === 0}
            className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primaryHover text-white py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/25 disabled:opacity-40"
          >
            Process Order
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
