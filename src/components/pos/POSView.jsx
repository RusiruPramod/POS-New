import React, { useState, useMemo } from "react";
import { usePOS } from "../../context/POSContext";
import { ProductCard } from "./ProductCard";
import { Cart } from "./Cart";
import { PaymentModal } from "./PaymentModal";
import { ProductModal } from "../products/ProductModal";
import {
  Search,
  X,
  PackagePlus,
  Store,
  Sparkles,
  Barcode,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export const POSView = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    cart,
    cartTotal,
    settings,
    scanBarcode,
    mobilePosTab,
    setMobilePosTab,
  } = usePOS();

  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);

  const cartTotalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Extract unique categories
  const categories = useMemo(() => {
    const list = products.map((p) => p.cat || "General").filter(Boolean);
    return ["All", ...new Set(list)];
  }, [products]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return products.filter((p) => {
      const matchCat =
        activeCategory === "All" || (p.cat || "General") === activeCategory;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchTerm]);

  // Handle Barcode Scanner Enter Key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      e.preventDefault();
      const res = scanBarcode(searchTerm);
      if (res.success) {
        setScanMessage({ type: "success", text: `Added "${res.product.name}" to cart!` });
        setSearchTerm("");
      } else {
        setScanMessage({ type: "error", text: res.error });
      }
      setTimeout(() => setScanMessage(null), 2500);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 overflow-hidden relative">
      {/* --- CATALOG COLUMN (Always visible on md+, toggled on mobile) --- */}
      <div
        className={`flex-1 flex flex-col gap-3.5 h-full overflow-hidden ${
          mobilePosTab === "cart" ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Search Bar & Quick Add */}
        <div className="glass p-2.5 rounded-2xl flex gap-2 border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="relative flex-1">
            <Barcode className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or scan barcode (Press Enter to add)..."
              className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700/80 rounded-xl py-2 px-3 pl-9 text-xs md:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-primary transition shadow-sm"
              autoComplete="off"
            />
          </div>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap"
            title="Quick add new product"
          >
            <PackagePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>

        {/* Barcode scanner flash notification */}
        {scanMessage && (
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              scanMessage.type === "success"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
            }`}
          >
            <span>{scanMessage.text}</span>
          </div>
        )}

        {/* Categories Carousel */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white font-bold shadow-md shadow-blue-500/25"
                    : "bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid or Empty State */}
        <div className="flex-1 overflow-y-auto pr-1 pb-16 md:pb-0">
          {products.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 md:p-8 text-center glass rounded-2xl border border-gray-200 dark:border-gray-800 my-auto">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3.5 shadow-glow-primary">
                <Store className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1.5">
                Ready for Real Inventory
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mb-5 leading-relaxed">
                Add your real store products with cost, price, barcode/SKU, and stock levels to begin billing and generating invoices.
              </p>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-5 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Add First Product
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-2 glass rounded-2xl border border-gray-200 dark:border-gray-800">
              <Search className="w-10 h-10 opacity-30" />
              <p className="text-sm font-semibold">No products found for "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs text-primary font-bold hover:underline"
              >
                Reset search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-3.5 pb-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* Mobile Sticky Floating Cart Bar */}
        {cart.length > 0 && (
          <div className="md:hidden fixed bottom-3 inset-x-3 z-30 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => setMobilePosTab("cart")}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm border border-blue-400/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-mono font-bold">
                  {cartTotalQty}
                </span>
                <span>View Current Order</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-base font-black">
                <span>
                  {settings.currency} {cartTotal.toFixed(2)}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* --- CART COLUMN (Visible on md+, toggled on mobile) --- */}
      <div
        className={`w-full md:w-80 lg:w-96 h-full flex flex-col ${
          mobilePosTab === "cart" ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Mobile Back Button to Catalog */}
        <div className="md:hidden mb-2">
          <button
            onClick={() => setMobilePosTab("catalog")}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition shadow-sm w-full justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products Catalog
          </button>
        </div>

        <Cart onOpenPayment={() => setIsPaymentModalOpen(true)} />
      </div>

      {/* Payment & Checkout Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      {/* Quick Add Product Modal */}
      <ProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        editingProduct={null}
      />
    </div>
  );
};
