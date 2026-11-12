import React, { useState, useMemo, useEffect } from "react";
import { usePOS } from "../../context/POSContext";
import { Printer, Calendar, Search, DollarSign, Truck, Wallet, FileText } from "lucide-react";

export const FinanceView = () => {
  const { sales, settings, printFinancialStatement } = usePOS();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchInvoice, setSearchInvoice] = useState("");

  // Initialize dates to 1st of month till today
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const today = now.toISOString().split("T")[0];
    setFromDate(firstDay);
    setToDate(today);
  }, []);

  const { filteredSales, grossRev, totalDel, netRev } = useMemo(() => {
    let list = [...sales];
    const q = searchInvoice.toLowerCase().trim();

    if (q) {
      list = list.filter((s) => s.id.toLowerCase().includes(q));
    }

    if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      list = list.filter((s) => new Date(s.date) >= start);
    }

    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      list = list.filter((s) => new Date(s.date) <= end);
    }

    let gross = 0;
    let del = 0;
    let net = 0;

    list.forEach((s) => {
      const deliveryCharge =
        s.rawDelivery !== undefined
          ? s.rawDelivery
          : s.delivery > 0
          ? s.delivery
          : settings.delivery || 0;
      const grossTotal = s.total || 0;
      const netTotal = grossTotal - deliveryCharge;

      gross += grossTotal;
      del += deliveryCharge;
      net += netTotal;
    });

    return {
      filteredSales: list,
      grossRev: gross,
      totalDel: del,
      netRev: net,
    };
  }, [sales, fromDate, toDate, searchInvoice, settings]);

  const handlePrint = () => {
    printFinancialStatement({
      sales: filteredSales,
      fromDate,
      toDate,
      grossRev,
      totalDel,
      netRev,
      settings,
    });
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-5 rounded-2xl border-l-4 border-indigo-500 border-gray-200 dark:border-gray-800 flex justify-between items-center transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Gross Revenue</p>
            <h3 className="text-2xl font-black mt-1 text-gray-900 dark:text-white font-mono">
              {settings.currency} {grossRev.toFixed(2)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border-l-4 border-pink-500 border-gray-200 dark:border-gray-800 flex justify-between items-center transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Delivery Fees</p>
            <h3 className="text-2xl font-black mt-1 text-gray-900 dark:text-white font-mono">
              {settings.currency} {totalDel.toFixed(2)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border-l-4 border-emerald-500 border-gray-200 dark:border-gray-800 flex justify-between items-center transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Net Revenue (Gross - Delivery)
            </p>
            <h3 className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400 font-mono">
              {settings.currency} {netRev.toFixed(2)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Print Action Bar */}
      <div className="glass p-4 rounded-2xl flex flex-col lg:flex-row justify-between items-center gap-3 border border-gray-200 dark:border-gray-800 transition-colors">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Financial Ledger</h3>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
            <span>From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-1.5 px-2.5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
            <span>To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-1.5 px-2.5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
            />
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="Search Inv..."
              className="w-32 bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-1.5 px-2.5 pl-8 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
            />
          </div>

          <button
            onClick={handlePrint}
            disabled={filteredSales.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20 disabled:opacity-40"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Statement
          </button>
        </div>
      </div>

      {/* Financial Table */}
      <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/90 sticky top-0 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300">Invoice #</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300">Date</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-right">Subtotal</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-right">Tax</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-right">Discount</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-right">Delivery Charge</th>
                <th className="p-3.5 font-bold text-gray-700 dark:text-gray-300 text-right">Gross Total</th>
                <th className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                  Net (Total - Delivery)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No financial ledger records found for the selected period.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => {
                  const isFree = s.isFreeDelivery || false;
                  const deliveryCharge =
                    s.rawDelivery !== undefined
                      ? s.rawDelivery
                      : s.delivery > 0
                      ? s.delivery
                      : settings.delivery || 0;
                  const grossTotal = s.total || 0;
                  const netTotal = grossTotal - deliveryCharge;

                  return (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                      <td className="p-3.5 font-mono font-bold text-primary">
                        {s.id}
                      </td>
                      <td className="p-3.5 text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                        {new Date(s.date).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right font-mono text-gray-700 dark:text-gray-300">
                        {settings.currency} {Number(s.subtotal || 0).toFixed(2)}
                      </td>
                      <td className="p-3.5 text-right font-mono text-gray-500 dark:text-gray-400">
                        {settings.currency} {Number(s.tax || 0).toFixed(2)}
                      </td>
                      <td className="p-3.5 text-right font-mono text-red-600 dark:text-red-400">
                        {settings.currency} {Number(s.discount || 0).toFixed(2)}
                      </td>
                      <td className="p-3.5 text-right font-mono text-amber-600 dark:text-amber-300 font-semibold">
                        {settings.currency} {deliveryCharge.toFixed(2)}
                        {isFree && (
                          <span className="text-[10px] text-pink-600 dark:text-pink-400 block font-normal">
                            (Free Delivery)
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-gray-900 dark:text-white">
                        {settings.currency} {grossTotal.toFixed(2)}
                      </td>
                      <td className="p-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                        {settings.currency} {netTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
