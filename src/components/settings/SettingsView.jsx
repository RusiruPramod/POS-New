import React, { useState, useEffect } from "react";
import { usePOS } from "../../context/POSContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Save,
  RotateCcw,
  ShieldCheck,
  Building,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Palette,
} from "lucide-react";

export const SettingsView = () => {
  const { settings, updateSettings, hardReset } = usePOS();
  const { currentUser, updateAccount } = useAuth();
  const { theme, setTheme } = useTheme();

  // Settings form state
  const [company, setCompany] = useState(settings.company || "");
  const [phone, setPhone] = useState(settings.phone || "");
  const [address, setAddress] = useState(settings.address || "");
  const [logo, setLogo] = useState(settings.logo || "");
  const [currency, setCurrency] = useState(settings.currency || "Rs.");
  const [delivery, setDelivery] = useState(settings.delivery || 350);
  const [tax, setTax] = useState(settings.tax || 0);
  const [receiptSize, setReceiptSize] = useState(settings.receiptSize || "80mm");
  const [prefix, setPrefix] = useState(settings.prefix || "UM-");
  const [footer, setFooter] = useState(settings.footer || "");
  const [dualPrint, setDualPrint] = useState(settings.dualPrint || false);

  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Account security form state
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [accountSuccess, setAccountSuccess] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [updatingAccount, setUpdatingAccount] = useState(false);

  useEffect(() => {
    setCompany(settings.company || "");
    setPhone(settings.phone || "");
    setAddress(settings.address || "");
    setLogo(settings.logo || "");
    setCurrency(settings.currency || "Rs.");
    setDelivery(settings.delivery || 350);
    setTax(settings.tax || 0);
    setReceiptSize(settings.receiptSize || "80mm");
    setPrefix(settings.prefix || "UM-");
    setFooter(settings.footer || "");
    setDualPrint(settings.dualPrint || false);
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSuccess(false);

    await updateSettings({
      company: company.trim(),
      phone: phone.trim(),
      address: address.trim(),
      logo: logo.trim(),
      currency: currency.trim(),
      delivery: parseFloat(delivery) || 0,
      tax: parseFloat(tax) || 0,
      receiptSize,
      prefix: prefix.trim(),
      footer: footer.trim(),
      dualPrint,
    });

    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const handleHardReset = () => {
    if (
      window.confirm(
        "WARNING: This will wipe all current products, orders, and custom settings, resetting back to clean factory state. Proceed?"
      )
    ) {
      hardReset();
      alert("System has been reset to clean state.");
    }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setAccountError("");
    setAccountSuccess(false);

    if (!currentPassword) {
      setAccountError("Current password is required to make security changes.");
      return;
    }

    try {
      setUpdatingAccount(true);
      await updateAccount({
        currentPassword,
        newEmail: newEmail.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
      });

      setAccountSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setAccountSuccess(false), 3500);
    } catch (err) {
      setAccountError(err.message || "Account update failed.");
    } finally {
      setUpdatingAccount(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-10">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Appearance / Theme Selector Card */}
        <div className="glass p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="flex items-center gap-2.5 mb-4 border-b border-gray-200 dark:border-gray-800 pb-3">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appearance & Theme</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${theme === "dark"
                  ? "border-primary bg-primary/10 text-white font-bold shadow-md shadow-blue-500/20"
                  : "border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
            >
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-indigo-400 border border-gray-700">
                <Moon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-[11px] text-gray-400">Deep slate high-contrast UI</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${theme === "light"
                  ? "border-primary bg-primary/10 text-gray-900 font-bold shadow-md shadow-blue-500/20"
                  : "border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-200">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Light Mode</p>
                <p className="text-[11px] text-gray-400">Clean bright crisp UI</p>
              </div>
            </button>
          </div>
        </div>

        {/* Store Settings Card */}
        <div className="glass p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="flex items-center gap-2.5 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            <Building className="w-5 h-5 text-primary" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Store & Receipt Configuration</h3>
          </div>

          {settingsSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4" />
              Settings saved and synced to Firebase Cloud!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Company / Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Store Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Logo URL (Link or Base64 Data URL)
                </label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://... or data:image/png;base64,..."
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Currency Symbol *
                </label>
                <input
                  type="text"
                  required
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none font-bold shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Default Delivery Fee
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Receipt Paper Size
                </label>
                <select
                  value={receiptSize}
                  onChange={(e) => setReceiptSize(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
                >
                  <option value="58mm">58mm Thermal Receipt</option>
                  <option value="80mm">80mm Thermal Receipt (Standard)</option>
                  <option value="a6">A6 Invoice (105 x 148 mm)</option>
                  <option value="a5">A5 Invoice (148 x 210 mm)</option>
                  <option value="100%">A4 / Full Page Invoice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none font-mono shadow-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Receipt Footer Message
                </label>
                <input
                  type="text"
                  value={footer}
                  onChange={(e) => setFooter(e.target.value)}
                  className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
                />
              </div>

              {/* Dual Print Merchant Copy Option */}
              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900/90 p-4 rounded-xl border border-gray-200 dark:border-gray-700/80">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-900 dark:text-white font-bold">
                  <input
                    type="checkbox"
                    checked={dualPrint}
                    onChange={(e) => setDualPrint(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary bg-white dark:bg-gray-800"
                  />
                  Print Merchant Invoice (Dual Landscape Mode)
                </label>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 pl-6">
                  Automatically splits the page to print side-by-side Customer Copy and
                  Merchant Copy on a single landscape sheet.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <button
                type="button"
                onClick={handleHardReset}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600/10 text-red-600 dark:text-red-400 hover:bg-red-600/20 border border-red-500/20 rounded-xl text-xs font-bold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Factory Reset
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/25"
              >
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Account & Security Card */}
        <div className="glass p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="flex items-center gap-2.5 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Account & Cloud Security</h3>
          </div>

          {accountSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4" />
              Account credentials successfully updated!
            </div>
          )}

          {accountError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              {accountError}
            </div>
          )}

          <form onSubmit={handleUpdateAccount} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Current Registered Email
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ""}
                className="w-full bg-gray-100 dark:bg-darkBg/60 border border-gray-200 dark:border-gray-800 rounded-xl py-2 px-3 text-xs text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                New Email Address (Leave blank to keep current)
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="newemail@domain.com"
                className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Current Password <span className="text-red-500">*</span> (Required for verification)
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                New Password (Leave blank to keep current)
              </label>
              <input
                type="password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none shadow-sm"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updatingAccount}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/25 disabled:opacity-50"
              >
                {updatingAccount ? "Updating..." : "Update Account Credentials"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
