"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Settings, Globe, Bell, Sun, Sparkles, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [dailyTips, setDailyTips] = useState(true);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {t("settings") || "Settings"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Configure languages, alert preferences, and theme modes</p>
      </header>

      <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-gray-50 dark:border-white/5">
          <div className="flex gap-3 items-start">
            <Globe className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">{t("select_language") || "Select Language"}</h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Translate the entire UI dynamically</p>
            </div>
          </div>
          <select 
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="w-full sm:w-48 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-gray-800 dark:text-gray-200 font-bold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50 dark:bg-white/5 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
          </select>
        </div>

        {/* Notifications Toggle */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-50 dark:border-white/5">
          <div className="flex gap-3 items-start">
            <Bell className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">{t("notifications") || "Notifications"}</h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Receive alerts on sudden crop price drops and weather events</p>
            </div>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${notifications ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Daily Tips Toggle */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-50 dark:border-white/5">
          <div className="flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">{t("daily_tips") || "Daily Farming Tips"}</h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Get a customized smart farming suggestion every day on home screen</p>
            </div>
          </div>
          <button 
            onClick={() => setDailyTips(!dailyTips)}
            className={`w-11 h-6 rounded-full transition-colors relative ${dailyTips ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${dailyTips ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-start">
            {darkMode ? <Moon className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" /> : <Sun className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />}
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">{t("dark_mode") || "Dark Mode"}</h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Switch between light and dark backgrounds</p>
            </div>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

      </div>
    </div>
  );
}
