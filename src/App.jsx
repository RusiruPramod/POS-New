import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { POSProvider, usePOS } from "./context/POSContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { AuthModal } from "./components/modals/AuthModal";
import { POSView } from "./components/pos/POSView";
import { DashboardView } from "./components/dashboard/DashboardView";
import { ProductsView } from "./components/products/ProductsView";
import { HistoryView } from "./components/history/HistoryView";
import { FinanceView } from "./components/finance/FinanceView";
import { ReportsView } from "./components/reports/ReportsView";
import { SettingsView } from "./components/settings/SettingsView";
import { ReceiptPrintWrapper } from "./components/print/ReceiptPrintWrapper";
import { FinancePrintWrapper } from "./components/print/FinancePrintWrapper";

const MainLayout = () => {
  const { currentUser } = useAuth();
  const { currentView } = usePOS();

  const renderActiveView = () => {
    switch (currentView) {
      case "pos":
        return <POSView />;
      case "dashboard":
        return <DashboardView />;
      case "products":
        return <ProductsView />;
      case "history":
        return <HistoryView />;
      case "finance":
        return <FinanceView />;
      case "reports":
        return <ReportsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <POSView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-darkBg text-gray-900 dark:text-gray-100 font-sans select-none transition-colors duration-200">
      {/* Firebase Cloud Authentication Modal */}
      <AuthModal />

      {/* Main Workspace (active only when logged in) */}
      {currentUser && (
        <>
          <Sidebar />

          <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100 dark:from-darkBg dark:via-slate-900 dark:to-gray-950 transition-colors duration-200">
            <Header />

            <div
              className={`flex-1 p-2.5 sm:p-4 md:p-6 relative ${currentView === "pos" ? "overflow-hidden flex flex-col" : "overflow-y-auto"
                }`}
            >
              {renderActiveView()}
            </div>
          </main>
        </>
      )}

      {/* Hidden print templates for window.print() */}
      <ReceiptPrintWrapper />
      <FinancePrintWrapper />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <POSProvider>
          <MainLayout />
        </POSProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
