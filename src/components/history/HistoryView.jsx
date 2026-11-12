import React, { useState, useMemo } from "react";
import { usePOS } from "../../context/POSContext";
import { sendWhatsAppReceipt } from "../../services/whatsappService";
import {
  Search,
  Calendar,
  Printer,
  Smartphone,
  Edit,
  Trash2,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

export const HistoryView = () => {
  const { sales, settings, deleteSale, editSale, printReceipt, setCurrentView } = usePOS();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredSales = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return sales.filter((s) => {
      const matchQuery =
        !q ||
        s.id.toLowerCase().includes(q) ||
        (s.customer?.name && s.customer.name.toLowerCase().includes(q)) ||
        (s.customer?.phone && s.customer.phone.includes(q)) ||
        (s.customer?.tracking && s.customer.tracking.toLowerCase().includes(q));

      const matchDate =
        !filterDate ||
        new Date(s.date).toISOString().split("T")[0] === filterDate;

      return matchQuery && matchDate;
    });
  }, [sales, searchTerm, filterDate]);

  const handleDelete = (id) => {
    if (
      window.confirm(
        `Are you sure you want to delete order ${id}? Product stocks will be automatically restored.`
      )
    ) {
      deleteSale(id);
    }
  };

  const handleEdit = (id) => {
    if (
      window.confirm(
        `Edit order ${id}? This will restore stock, load the items back into the cart, and open the POS screen.`
      )
    ) {
      editSale(id);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Search & Filter Bar */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-3 border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 pl-9 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition shadow-sm"
            />
          </div>
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline font-semibold"
            >
              Reset Date
            </button>
          )}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice, customer, tracking..."
            className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 pl-9 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/90 sticky top-0 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300">Invoice #</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300">Customer & Courier</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300">Date & Time</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-right">Total Amount</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-center">Payment</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                        No Sales Records Yet
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                        Completed orders and dispatched courier records will appear here with instant WhatsApp and Print options.
                      </p>
                      <button
                        onClick={() => setCurrentView("pos")}
                        className="px-5 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/25"
                      >
                        Go to POS Billing
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                    <td className="p-3.5 font-mono font-bold text-primary">
                      {sale.id}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-gray-900 dark:text-gray-100 block">
                        {sale.customer?.name || "Walk-in Customer"}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                        {sale.customer?.phone || "No phone"}
                        {sale.customer?.tracking && (
                          <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                            • Track: {sale.customer.tracking}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                      {new Date(sale.date).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {settings.currency} {Number(sale.total).toFixed(2)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                        {sale.paymentMethod || "COD"}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(sale.id)}
                          className="px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          title="Edit order & reload to POS"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(sale.id)}
                          className="px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          title="Delete order & restore stock"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>

                        <button
                          onClick={() => sendWhatsAppReceipt(sale, settings)}
                          className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          title="Open WhatsApp Web receipt"
                        >
                          <Smartphone className="w-3 h-3" />
                          WhatsApp
                        </button>

                        <button
                          onClick={() => printReceipt(sale)}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                          title="Print Receipt"
                        >
                          <Printer className="w-3 h-3" />
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
