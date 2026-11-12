import React, { useState, useMemo, useRef } from "react";
import { usePOS } from "../../context/POSContext";
import { ProductModal } from "./ProductModal";
import {
  Search,
  Plus,
  Download,
  Upload,
  Edit2,
  Trash2,
  Package,
  PackagePlus,
  Sparkles,
} from "lucide-react";

export const ProductsView = () => {
  const { products, deleteProduct, exportProducts, importProducts, settings } =
    usePOS();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef(null);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.cat && p.cat.toLowerCase().includes(q))
    );
  }, [products, searchTerm]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          await importProducts(parsed);
          alert("Products successfully imported!");
        } else {
          alert("Invalid file structure. Expected an array of products.");
        }
      } catch (err) {
        alert("JSON parse error: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Top Action Bar */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-3 border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, SKU or category..."
            className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 pl-9 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={exportProducts}
            disabled={products.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition border border-gray-200 dark:border-gray-700 shadow-sm disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            Import JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/90 sticky top-0 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300">Product Name</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300">SKU / Barcode</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300">Category</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300">Size</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-right">Cost Price</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-right">Selling Price</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-center">Stock</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <PackagePlus className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                        No Products in Database
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                        Your real products inventory is ready to be populated. Click Add Product to start adding your real stock.
                      </p>
                      <button
                        onClick={handleAddNew}
                        className="px-5 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Product
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No products match "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock <= (p.minStock || 5);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                      <td className="p-3.5 font-bold text-gray-900 dark:text-gray-100 max-w-[200px] truncate">
                        {p.name}
                      </td>
                      <td className="p-3.5 text-primary font-mono font-bold">
                        {p.sku || "-"}
                      </td>
                      <td className="p-3.5 text-gray-600 dark:text-gray-300">{p.cat || "General"}</td>
                      <td className="p-3.5 text-gray-500 dark:text-gray-400 font-mono">
                        {p.size || "-"}
                      </td>
                      <td className="p-3.5 text-right font-mono text-gray-600 dark:text-gray-300">
                        {settings.currency} {Number(p.cost || 0).toFixed(2)}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {settings.currency} {Number(p.price || 0).toFixed(2)}
                      </td>
                      <td className="p-3.5 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                            isLow
                              ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20"
                              : "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
      />
    </div>
  );
};
