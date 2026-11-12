import React from "react";
import { usePOS } from "../../context/POSContext";
import { Plus } from "lucide-react";

export const ProductCard = ({ product }) => {
  const { addToCart, settings } = usePOS();
  const isLowStock = product.stock <= (product.minStock || 5);
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => !isOutOfStock && addToCart(product.id)}
      className={`glass p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group select-none ${
        isOutOfStock
          ? "opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-800"
          : "cursor-pointer hover:border-primary/60 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 border-gray-200/90 dark:border-gray-800/80 bg-white/70 dark:bg-slate-900/60"
      }`}
    >
      <div>
        <div className="flex justify-between items-start gap-1">
          <span className="text-[11px] text-primary font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20 truncate">
            {product.sku || "NO-SKU"}
          </span>
          {product.size && product.size !== "-" && (
            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 font-mono font-semibold">
              Size: {product.size}
            </span>
          )}
        </div>

        <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition line-clamp-2 mt-2.5 text-sm leading-snug">
          {product.name}
        </h4>

        {product.cat && (
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-1 block">
            {product.cat}
          </span>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block -mb-0.5">Price</span>
          <span className="font-black text-emerald-600 dark:text-emerald-400 text-base font-mono">
            {settings.currency} {Number(product.price).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono ${
              isOutOfStock
                ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20"
                : isLowStock
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/20"
                : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/90"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
          </span>
          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
