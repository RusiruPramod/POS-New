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
} from "lucide-react";

export const Sidebar = () => {
  const { currentView, setCurrentView, settings } = usePOS();

  const navItems = [
    { id: "pos", label: "POS / Billing", icon: ShoppingCart },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "history", label: "Sales History", icon: History },
    { id: "finance", label: "Finance", icon: Coins },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-16 md:w-64 glass h-full flex flex-col transition-all duration-300 z-10 border-r border-gray-200 dark:border-gray-800">
      {/* Brand / Logo */}
      <div className="h-24 flex flex-col items-center justify-center border-b border-gray-200 dark:border-gray-800 p-3 text-center overflow-hidden">
        {settings.logo ? (
          <img
            src={settings.logo}
            alt={settings.company || "Unyt Mart Logo"}
            className="max-h-14 max-w-full object-contain rounded"
          />
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-500/25">
              UM
            </div>
            <span className="hidden md:block font-black text-gray-900 dark:text-gray-100 text-xs tracking-wider uppercase mt-1.5 truncate max-w-[200px]">
              {settings.company || "Unyt Mart"}
            </span>
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto py-3 flex flex-col gap-1.5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center p-2.5 md:p-3 rounded-xl transition-all duration-150 w-full text-left font-semibold text-xs md:text-sm ${
                isActive
                  ? "bg-primary text-white font-bold shadow-lg shadow-blue-500/25"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60"
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 md:mr-3" />
              <span className="hidden md:block">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* App Version */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 text-center text-[11px] text-gray-400 dark:text-gray-500 font-mono">
        <span className="hidden md:block">Unyt Mart Cloud v2.1</span>
        <span className="md:hidden">v2.1</span>
      </div>
    </aside>
  );
};
