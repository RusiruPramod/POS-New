import React, { useMemo } from "react";
import { usePOS } from "../../context/POSContext";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ShoppingBag,
  AlertTriangle,
  Clock,
  ArrowRight,
  PackageOpen,
  Receipt,
} from "lucide-react";

export const DashboardView = () => {
  const { products, sales, settings, setCurrentView } = usePOS();

  // Calculate Today's Stats
  const { todaySalesTotal, todayOrdersCount, todayProfit, monthlyRevenue } =
    useMemo(() => {
      const todayStr = new Date().toDateString();
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let todayTotal = 0;
      let todayCount = 0;
      let todayNet = 0;
      let todayItemCost = 0;
      let monthTotal = 0;

      sales.forEach((s) => {
        const sDate = new Date(s.date);

        // Check if current month
        if (
          sDate.getMonth() === currentMonth &&
          sDate.getFullYear() === currentYear
        ) {
          monthTotal += s.total || 0;
        }

        // Check if today
        if (sDate.toDateString() === todayStr) {
          todayTotal += s.total || 0;
          todayCount += 1;

          const deliveryFee =
            s.rawDelivery !== undefined
              ? s.rawDelivery
              : s.delivery > 0
              ? s.delivery
              : settings.delivery || 0;
          const net = (s.total || 0) - deliveryFee;
          todayNet += net;

          (s.items || []).forEach((item) => {
            todayItemCost += (item.cost || 0) * item.qty;
          });
        }
      });

      return {
        todaySalesTotal: todayTotal,
        todayOrdersCount: todayCount,
        todayProfit: todayNet - todayItemCost,
        monthlyRevenue: monthTotal,
      };
    }, [sales, settings]);

  // Low stock products
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= (p.minStock || 5));
  }, [products]);

  // Recent 5 sales
  const recentSales = useMemo(() => {
    return sales.slice(0, 5);
  }, [sales]);

  return (
    <div className="h-full overflow-y-auto space-y-6 pb-8">
      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="glass p-5 rounded-2xl border-l-4 border-blue-500 border-gray-200 dark:border-gray-800 flex justify-between items-start transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Today's Sales</p>
            <h3 className="text-2xl font-black mt-1 text-gray-900 dark:text-white font-mono">
              {settings.currency} {todaySalesTotal.toFixed(2)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Today's Profit */}
        <div className="glass p-5 rounded-2xl border-l-4 border-emerald-500 border-gray-200 dark:border-gray-800 flex justify-between items-start transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Today's Est. Profit</p>
            <h3 className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400 font-mono">
              {settings.currency} {todayProfit.toFixed(2)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="glass p-5 rounded-2xl border-l-4 border-purple-500 border-gray-200 dark:border-gray-800 flex justify-between items-start transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Monthly Revenue</p>
            <h3 className="text-2xl font-black mt-1 text-purple-600 dark:text-purple-300 font-mono">
              {settings.currency} {monthlyRevenue.toFixed(2)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Total Orders Today */}
        <div className="glass p-5 rounded-2xl border-l-4 border-amber-500 border-gray-200 dark:border-gray-800 flex justify-between items-start transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Orders Placed Today</p>
            <h3 className="text-2xl font-black mt-1 text-amber-600 dark:text-amber-300 font-mono">
              {todayOrdersCount}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="glass p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Low Stock Alerts</h3>
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
              {lowStockProducts.length} items
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800/80">
                  <th className="pb-2 font-semibold">Product</th>
                  <th className="pb-2 font-semibold">Remaining</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {lowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400 dark:text-gray-500">
                      <PackageOpen className="w-8 h-8 mx-auto mb-1.5 opacity-30" />
                      All inventory stock levels are healthy.
                    </td>
                  </tr>
                ) : (
                  lowStockProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                      <td className="py-2.5 font-bold text-gray-800 dark:text-gray-200">
                        {p.name}
                        {p.size && (
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1">
                            ({p.size})
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 font-mono font-bold text-red-600 dark:text-red-400">
                        {p.stock} units
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => setCurrentView("products")}
                          className="text-primary hover:underline text-xs font-bold"
                        >
                          Restock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Recent Orders</h3>
            </div>
            <button
              onClick={() => setCurrentView("history")}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800/80">
                  <th className="pb-2 font-semibold">Invoice #</th>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {recentSales.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400 dark:text-gray-500">
                      <Receipt className="w-8 h-8 mx-auto mb-1.5 opacity-30" />
                      No recent orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentSales.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                      <td className="py-2.5 font-mono font-bold text-primary">
                        {s.id}
                      </td>
                      <td className="py-2.5 text-gray-800 dark:text-gray-200 font-medium">
                        {s.customer?.name || "Walk-in"}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {settings.currency} {Number(s.total).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
