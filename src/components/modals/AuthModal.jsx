import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Lock, Mail, Store, AlertCircle, CheckCircle, ArrowLeft, KeyRound, Sun, Moon } from "lucide-react";

export const AuthModal = () => {
  const { currentUser, login, signup, resetPassword, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [tab, setTab] = useState("login"); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-100 dark:bg-darkBg z-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Connecting to Firebase Cloud...</span>
        </div>
      </div>
    );
  }

  if (currentUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (tab === "forgot") {
      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }
      try {
        setSubmitting(true);
        await resetPassword(email.trim());
        setSuccessMsg("Password reset email sent! Please check your inbox (and spam folder).");
      } catch (err) {
        setError(err.message || "Failed to send password reset email.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (tab === "signup" && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      if (tab === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
        setSuccessMsg("Account created! A verification email has been sent to your address.");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 dark:bg-darkBg/95 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-colors">
      {/* Theme toggle corner button */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 p-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-lg transition"
        title="Toggle Light / Dark mode"
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
      </button>

      <div className="bg-white dark:bg-darkPanel/95 p-8 rounded-3xl w-full max-w-md border border-gray-200 dark:border-gray-700/80 shadow-2xl relative overflow-hidden transition-all">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 rounded-2xl bg-primary/10 border border-primary/20 mb-3 text-primary shadow-glow-primary">
            {tab === "forgot" ? <KeyRound className="w-8 h-8" /> : <Store className="w-8 h-8" />}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {tab === "forgot" ? "Reset Password" : "Unyt Mart POS"}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
            {tab === "login"
              ? "Sign in to access real-time cloud data from any device"
              : tab === "signup"
              ? "Create an account to start syncing across devices"
              : "Enter your registered email to receive a password reset link"}
          </p>
        </div>

        {/* Tab Switcher (Visible on login & signup) */}
        {tab !== "forgot" ? (
          <div className="flex bg-gray-100 dark:bg-gray-900/90 rounded-2xl p-1 mb-6 border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                tab === "login"
                  ? "bg-primary text-white shadow-md shadow-blue-500/25"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                tab === "signup"
                  ? "bg-green-600 text-white shadow-md shadow-green-600/25"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Register Account
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError("");
              setSuccessMsg("");
            }}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline font-bold mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-600 dark:text-red-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 pl-10 text-gray-900 dark:text-white text-xs md:text-sm focus:border-primary focus:outline-none transition shadow-sm"
                placeholder="admin@unytmart.com"
              />
            </div>
          </div>

          {tab !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                {tab === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("forgot");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="text-[11px] text-primary font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 pl-10 text-gray-900 dark:text-white text-xs md:text-sm focus:border-primary focus:outline-none transition shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {tab === "signup" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-darkBg border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-3 pl-10 text-gray-900 dark:text-white text-xs md:text-sm focus:border-primary focus:outline-none transition shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-bold text-xs md:text-sm text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
              tab === "login"
                ? "bg-primary hover:bg-primaryHover shadow-blue-500/25"
                : tab === "signup"
                ? "bg-green-600 hover:bg-green-700 shadow-green-600/25"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
            } disabled:opacity-50`}
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : tab === "login" ? (
              "Sign In to POS"
            ) : tab === "signup" ? (
              "Create Account"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
