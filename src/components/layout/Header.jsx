import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePOS } from "../../context/POSContext";
import { useTheme } from "../../context/ThemeContext";
import { LogOut, RefreshCw, Sun, Moon, Menu, X, ShoppingCart } from "lucide-react";

export const Header = () => {
  const { currentUser, logout } = useAuth();
  const {
    currentView,
    cloudSyncing,
    isMobileNavOpen,
    setIsMobileNavOpen,
    cart,
    setMobilePosTab,
    mobilePosTab,
  } = usePOS();
  const { isDark, toggleTheme } = useTheme();
  const [dateTime, setDateTime] = useState("");

  const cartTotalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    const updateTime = () => {
      setDateTime(new Date().toLocaleString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const viewTitles = {
    pos: "POS / BILLING",
    dashboard: "DASHBOARD",
    products: "PRODUCTS INVENTORY",
    history: "SALES & DISPATCH",
    finance: "FINANCE & LEDGER",
    reports: "ANALYTICS & REPORTS",
    settings: "SYSTEM SETTINGS",
  };

  const userInitials = (currentUser?.email || "UM")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 glass flex items-center justify-between px-3 md:px-6 z-20 border-b border-gray-200 dark:border-gray-800 transition-colors flex-shrink-0">
      {/* Left: Mobile hamburger menu & View Title */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setIsMobileNavOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition shadow-sm"
          title="Open Menu"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <h2 className="text-sm md:text-lg font-black tracking-wider text-gray-900 dark:text-white uppercase font-sans truncate max-w-[140px] sm:max-w-none">
          {viewTitles[currentView] || "POS SYSTEM"}
        </h2>

        {/* Cloud sync status indicator */}
        {cloudSyncing ? (
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span className="hidden lg:inline">Syncing...</span>
          </span>
        ) : (
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden lg:inline">Cloud Synced</span>
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile POS Cart Switcher pill (Only on mobile when in POS view) */}
        {currentView === "pos" && (
          <button
            onClick={() =>
              setMobilePosTab((prev) => (prev === "cart" ? "catalog" : "cart"))
            }
            className={`md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
              mobilePosTab === "cart"
                ? "bg-primary text-white border-primary"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{mobilePosTab === "cart" ? "Catalog" : `Cart (${cartTotalQty})`}</span>
          </button>
        )}

        <span className="hidden xl:block text-xs text-gray-500 dark:text-gray-400 font-mono">
          {dateTime}
        </span>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 rounded-xl border transition-all text-xs font-bold shadow-sm bg-white hover:bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800/90 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden lg:inline">Dark</span>
            </>
          )}
        </button>

        {/* User Profile Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800/90 px-2.5 py-1 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-[10px] md:text-xs font-black text-white shadow-sm">
            {userInitials}
          </div>
          <span className="hidden md:block text-xs text-gray-700 dark:text-gray-300 font-semibold max-w-[110px] truncate">
            {currentUser?.email || "Admin"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Logout"
          className="flex items-center gap-1.5 p-2 md:px-3 md:py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
