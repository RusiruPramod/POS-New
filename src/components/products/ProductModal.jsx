import React, { useState, useEffect } from "react";
import { usePOS } from "../../context/POSContext";
import { X, Check } from "lucide-react";

export const ProductModal = ({ isOpen, onClose, editingProduct }) => {
  const { products, saveProduct, settings } = usePOS();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [cat, setCat] = useState("");
  const [size, setSize] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("5");

  // Existing categories for autocomplete datalist
  const existingCategories = Array.from(
    new Set(products.map((p) => p.cat).filter(Boolean))
  );

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setSku(editingProduct.sku || "");
      setCat(editingProduct.cat || "");
      setSize(editingProduct.size || "");
      setCost(editingProduct.cost ?? "");
      setPrice(editingProduct.price ?? "");
      setStock(editingProduct.stock ?? "");
      setMinStock(editingProduct.minStock ?? 5);
    } else {
      setName("");
      setSku("");
      setCat("");
      setSize("");
      setCost("");
      setPrice("");
      setStock("");
      setMinStock("5");
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productPayload = {
      ...(editingProduct?.id ? { id: editingProduct.id } : {}),
      name: name.trim(),
      sku: sku.trim(),
      cat: cat.trim() || "General",
      size: size.trim(),
      cost: parseFloat(cost) || 0,
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
      minStock: parseInt(minStock, 10) || 5,
    };

    await saveProduct(productPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkPanel border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-xl shadow-2xl overflow-y-auto max-h-[92vh] relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:hover:text-white p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg md:text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-800 pb-3 text-gray-900 dark:text-white">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Smart Watch / T-Shirt / Rice 5kg"
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs focus:border-primary focus:outline-none transition shadow-sm"
              />
            </div>

            {/* Barcode / SKU */}
            <div>
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Barcode / SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. PRD-001 or scan code"
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs font-mono focus:border-primary focus:outline-none transition shadow-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Category
              </label>
              <input
                type="text"
                list="product-categories-list"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                placeholder="Electronics, Apparel, Grocery..."
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs focus:border-primary focus:outline-none transition shadow-sm"
              />
              <datalist id="product-categories-list">
                {existingCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {/* Size */}
            <div>
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Size / Variant
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. S, M, L, XL, 500ml"
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs focus:border-primary focus:outline-none transition shadow-sm"
              />
            </div>

            {/* Buying Price */}
            <div>
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Cost Price ({settings.currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs font-mono focus:border-primary focus:outline-none transition shadow-sm"
              />
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Selling Price ({settings.currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:border-primary focus:outline-none transition shadow-sm"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Current Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs font-mono focus:border-primary focus:outline-none transition shadow-sm"
              />
            </div>

            {/* Min Stock Alert */}
            <div>
              <label className="block text-xs text-gray-700 dark:text-gray-300 font-bold mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="5"
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-gray-900 dark:text-white text-xs font-mono focus:border-primary focus:outline-none transition shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl font-bold text-xs transition shadow-lg shadow-blue-500/25 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
