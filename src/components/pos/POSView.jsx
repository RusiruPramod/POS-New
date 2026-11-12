import React, { useState, useMemo } from "react";
import { usePOS } from "../../context/POSContext";
import { ProductCard } from "./ProductCard";
import { Cart } from "./Cart";
import { PaymentModal } from "./PaymentModal";
import { ProductModal } from "../products/ProductModal";
import { Search, X, PackagePlus, Store, Sparkles } from "lucide-react";

export const POSView = () => {
  const { products, activeCategory, setActiveCategory } = usePOS();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

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

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 overflow-hidden">
      {/* Left: Product Search, Category Tabs & Grid */}
      <div className="flex-1 flex flex-col gap-3.5 h-full overflow-hidden">
        {/* Search Bar & Quick Add */}
        <div className="glass p-2.5 rounded-2xl flex gap-2 border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, SKU or scan barcode..."
              className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700/80 rounded-xl py-2 px-3 pl-9 text-xs md:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-primary transition"
              autoComplete="off"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold transition shadow-sm"
            title="Quick add new product"
          >
            <PackagePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>

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
        <div className="flex-1 overflow-y-auto pr-1">
          {products.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center glass rounded-2xl border border-gray-200 dark:border-gray-800 my-auto">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-glow-primary">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">
                Your Inventory is Ready for Real Products
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mb-6 leading-relaxed">
                All demo data has been cleared. Add your actual store items, prices, barcodes, and stock levels to start billing customers.
              </p>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-6 py-3 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Add Your First Product
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-2 glass rounded-2xl border border-gray-200 dark:border-gray-800">
              <Search className="w-10 h-10 opacity-30" />
              <p className="text-sm font-semibold">No products found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs text-primary font-bold hover:underline"
              >
                Reset search filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 pb-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart Component */}
      <Cart onOpenPayment={() => setIsPaymentModalOpen(true)} />

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
