import React, { useMemo } from "react";
import { usePOS } from "../../context/POSContext";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Package,
  CreditCard,
  Award,
  BarChart3,
} from "lucide-react";

export const ReportsView = () => {
  const { sales, settings } = usePOS();

  const {
    totalRevenue,
    totalProfit,
    totalTransactions,
    totalItemsSold,
    paymentBreakdown,
    topSellingItems,
  } = useMemo(() => {
    let rev = 0;
    let itemsCount = 0;
    let netRev = 0;
    let totalCost = 0;
    const pmCounts = {};
    const itemMap = {};

    sales.forEach((s) => {
      rev += s.total || 0;

      const del =
        s.rawDelivery !== undefined
          ? s.rawDelivery
          : s.delivery > 0
            ? s.delivery
            : settings.delivery || 0;
      netRev += (s.total || 0) - del;

      const pm = s.paymentMethod || "COD";
      pmCounts[pm] = (pmCounts[pm] || 0) + (s.total || 0);

      (s.items || []).forEach((item) => {
        itemsCount += item.qty;
        totalCost += (item.cost || 0) * item.qty;

        if (!itemMap[item.name]) {
          itemMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
        }
        itemMap[item.name].qty += item.qty;
        itemMap[item.name].revenue += item.price * item.qty;
      });
    });

    const topItems = Object.values(itemMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return {
      totalRevenue: rev,
      totalProfit: netRev - totalCost,
      totalTransactions: sales.length,
      totalItemsSold: itemsCount,
      paymentBreakdown: pmCounts,
      topSellingItems: topItems,
    };
  }, [sales, settings]);

  return (
    <div className="h-full overflow-y-auto space-y-6 pb-8">
      {/* Header pill */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">All-Time Performance Report</h3>
        <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-bold">
          Lifetime Metrics
        </span>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Revenue</p>
          <h4 className="text-xl md:text-2xl font-black mt-1 text-gray-900 dark:text-white font-mono">
            {settings.currency} {totalRevenue.toFixed(2)}
          </h4>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Est. Profit</p>
          <h4 className="text-xl md:text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400 font-mono">
            {settings.currency} {totalProfit.toFixed(2)}
          </h4>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-2">
            <Receipt className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Transactions</p>
          <h4 className="text-xl md:text-2xl font-black mt-1 text-purple-600 dark:text-purple-300 font-mono">
            {totalTransactions}
          </h4>
        </div>

        <div className="glass p-5 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
          <div className="p-2 w-fit rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
            <Package className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Items Sold</p>
          <h4 className="text-xl md:text-2xl font-black mt-1 text-amber-600 dark:text-amber-300 font-mono">
            {totalItemsSold}
          </h4>
        </div>
      </div>

      {/* Additional Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="glass p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-800 pb-3">
            <CreditCard className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Payment Method Distribution</h4>
          </div>
          <div className="space-y-3.5">
            {Object.keys(paymentBreakdown).length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <BarChart3 className="w-8 h-8 mx-auto mb-1.5 opacity-30" />
                <p className="text-xs">No sales recorded yet.</p>
              </div>
            ) : (
              Object.entries(paymentBreakdown).map(([method, amount]) => {
                const percent =
                  totalRevenue > 0
                    ? ((amount / totalRevenue) * 100).toFixed(1)
                    : 0;
                return (
                  <div key={method} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{method}</span>
                      <span className="font-mono text-gray-600 dark:text-gray-400">
                        {settings.currency} {amount.toFixed(2)} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top 5 Products */}
        <div className="glass p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-800 pb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Top 5 Selling Items</h4>
          </div>
          <div className="space-y-2.5">
            {topSellingItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <Award className="w-8 h-8 mx-auto mb-1.5 opacity-30" />
                <p className="text-xs">No sales recorded yet.</p>
              </div>
            ) : (
              topSellingItems.map((item, idx) => (
                <div
                  key={item.name}
                  className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl flex items-center justify-between border border-gray-200/80 dark:border-gray-800/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs font-mono">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                      {settings.currency} {item.revenue.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      {item.qty} units sold
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
