import React from "react";
import { usePOS } from "../../context/POSContext";
import {
  ShoppingCart,
  LayoutDashboard,
  Package,
  History,
  Coins,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

export const Sidebar = () => {
  const {
    currentView,
    setCurrentView,
    settings,
    isMobileNavOpen,
    setIsMobileNavOpen,
  } = usePOS();

  const navItems = [
    { id: "pos", label: "POS / Billing", icon: ShoppingCart },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products Inventory", icon: Package },
    { id: "history", label: "Sales & Dispatch", icon: History },
    { id: "finance", label: "Finance & Ledger", icon: Coins },
    { id: "reports", label: "Analytics & Reports", icon: BarChart3 },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar (Permanent on md+, Slide-over drawer on mobile) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-60 lg:w-64 glass h-full flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-slate-900/95 md:bg-transparent ${
          isMobileNavOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 text-center overflow-hidden">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt={settings.company || "Unyt Mart Logo"}
                className="max-h-12 max-w-full object-contain rounded"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-500/25">
                UM
              </div>
            )}
            <div className="text-left">
              <span className="block font-black text-gray-900 dark:text-gray-100 text-xs tracking-wider uppercase truncate max-w-[150px]">
                {settings.company || "Unyt Mart"}
              </span>
              <span className="block text-[10px] text-gray-400 font-mono">Cloud POS v2.1</span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 overflow-y-auto py-3.5 flex flex-col gap-1 px-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center p-3 rounded-xl transition-all duration-150 w-full text-left font-bold text-xs md:text-sm ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60"
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mr-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-3.5 border-t border-gray-200 dark:border-gray-800 text-center text-[11px] text-gray-400 dark:text-gray-500 font-mono">
          Ready for Mobile & Desktop
        </div>
      </aside>
    </>
  );
};
