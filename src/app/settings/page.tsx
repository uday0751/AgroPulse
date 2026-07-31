"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  Settings, Globe, Bell, Sun, Sparkles, Moon, ShieldCheck, 
  User, Mail, Smartphone, Volume2, Database, Trash2, RefreshCw, CheckCircle2, DollarSign
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();

  // Settings States
  const [notifications, setNotifications] = useState(true);
  const [dailyTips, setDailyTips] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [currency, setCurrency] = useState("₹ INR");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem("agropulse_settings_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.notifications ?? true);
        setDailyTips(parsed.dailyTips ?? true);
        setSmsAlerts(parsed.smsAlerts ?? true);
        setWeatherAlerts(parsed.weatherAlerts ?? true);
        setCurrency(parsed.currency || "₹ INR");
      } catch (e) { console.error(e); }
    }
  }, []);

  // Save settings handler
  const handleSaveSettings = (key: string, val: any) => {
    const current = {
      notifications,
      dailyTips,
      smsAlerts,
      weatherAlerts,
      currency,
      [key]: val
    };
    localStorage.setItem("agropulse_settings_config", JSON.stringify(current));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleSaveSettings("lang", lng);
  };

  const handleResetSettings = () => {
    if (confirm("Reset all platform preferences to factory defaults?")) {
      localStorage.removeItem("agropulse_settings_config");
      setNotifications(true);
      setDailyTips(true);
      setSmsAlerts(true);
      setWeatherAlerts(true);
      setCurrency("₹ INR");
      alert("Settings reset to default!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans max-w-5xl mx-auto space-y-8 pt-[78px]">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-800 to-green-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-green-700/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-extrabold text-green-300 border border-white/20">
            <Settings className="w-3.5 h-3.5 text-yellow-400" />
            <span>Platform Preferences & Controls</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white">
            System & Account Settings
          </h1>

          <p className="text-green-100/90 text-xs font-medium max-w-xl">
            Configure multi-lingual translation, APMC Mandi SMS alerts, dark mode aesthetics, and currency defaults.
          </p>
        </div>

        {/* DEVELOPER CREDITS CARD */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-xs space-y-1 shrink-0 relative z-10">
          <div className="flex items-center gap-2 text-green-300 font-extrabold">
            <User className="w-4 h-4 text-green-400" />
            <span className="text-white font-extrabold">Uday Pratap Singh Chauhan</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-green-200">
            <Mail className="w-3.5 h-3.5 text-green-400" />
            <a href="mailto:udchauhan0987@gmail.com" className="hover:underline font-bold text-white">udchauhan0987@gmail.com</a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {savedSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border border-green-300"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>Settings saved successfully to local configuration.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        
        {/* SECTION 1: LANGUAGE & CURRENCY */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/10">
            <Globe className="w-4 h-4" /> Language & Currency Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block font-bold text-xs text-gray-700 dark:text-gray-300 mb-1.5">
                UI Language Translation:
              </label>
              <select 
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-white/5 cursor-pointer"
              >
                <option value="en">English (Global)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-xs text-gray-700 dark:text-gray-300 mb-1.5">
                Preferred Crop Currency:
              </label>
              <select 
                onChange={(e) => {
                  setCurrency(e.target.value);
                  handleSaveSettings("currency", e.target.value);
                }}
                value={currency}
                className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-white/5 cursor-pointer"
              >
                <option value="₹ INR">₹ Indian Rupee (INR)</option>
                <option value="$ USD">$ US Dollar (USD)</option>
                <option value="€ EUR">€ Euro (EUR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: NOTIFICATIONS & MANDI ALERTS */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/10">
            <Bell className="w-4 h-4" /> Alerts & Notifications
          </h2>

          <div className="space-y-4">
            {/* Main Notifications */}
            <div className="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="flex gap-3 items-center">
                <Bell className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-xs">Mandi Rate Drop & Surge Alerts</h3>
                  <p className="text-[11px] text-gray-400 font-semibold">Receive real-time notifications on APMC rate spikes for Wheat, Basmati, & Soybean.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const val = !notifications;
                  setNotifications(val);
                  handleSaveSettings("notifications", val);
                }}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${notifications ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${notifications ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Weather Alerts */}
            <div className="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="flex gap-3 items-center">
                <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-xs">Satellite Weather Storm Alerts</h3>
                  <p className="text-[11px] text-gray-400 font-semibold">Get high-priority rainfall alerts tailored to your GPS location.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const val = !weatherAlerts;
                  setWeatherAlerts(val);
                  handleSaveSettings("weatherAlerts", val);
                }}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${weatherAlerts ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${weatherAlerts ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Daily Tips */}
            <div className="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="flex gap-3 items-center">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-xs">Daily Smart Farming Tips</h3>
                  <p className="text-[11px] text-gray-400 font-semibold">Receive daily sowing and organic fertilizer suggestions on Dashboard.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const val = !dailyTips;
                  setDailyTips(val);
                  handleSaveSettings("dailyTips", val);
                }}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${dailyTips ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${dailyTips ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: APPEARANCE & THEME */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/10">
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Theme & Aesthetics
          </h2>

          <div className="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="flex gap-3 items-center">
              {darkMode ? <Moon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" /> : <Sun className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />}
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-xs">Dark Mode Interface</h3>
                <p className="text-[11px] text-gray-400 font-semibold">Switch between sleek dark glassmorphism and clean light themes.</p>
              </div>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${darkMode ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {/* SECTION 4: DATA RESET */}
        <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
          <div>
            <h3 className="font-black text-xs text-gray-900 dark:text-white">Reset Preferences</h3>
            <p className="text-[11px] text-gray-400 font-medium">Revert all custom preferences back to factory defaults.</p>
          </div>
          <button
            onClick={handleResetSettings}
            className="px-4 py-2 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-extrabold text-xs rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-1.5 hover:bg-red-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
        </div>

      </div>
    </div>
  );
}

function RotateCcw(props: any) {
  return <RefreshCw {...props} />;
}
