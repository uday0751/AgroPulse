"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Bell, User, Menu, X, Landmark, CloudRain, ShieldAlert, BadgePercent, MessageSquare, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";

interface NotificationItem {
  id: string;
  type: "price" | "weather" | "scheme" | "expert" | "community";
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  icon: any;
  color: string;
}

export function Header() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "n1", type: "price", title: "Price Drop Alert", desc: "Cotton prices in Rajkot dropped by 3.1% below MSP.", time: "10 mins ago", unread: true, icon: BadgePercent, color: "text-red-600 bg-red-50 dark:bg-red-900/30" },
    { id: "n2", type: "weather", title: "Rain Prediction", desc: "Heavy rain forecasted in Pune tomorrow. Postpone spraying.", time: "1 hour ago", unread: true, icon: CloudRain, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30" },
    { id: "n3", type: "expert", title: "Expert Advice Received", desc: "Dr. Ramesh Patel replied to your pest control ticket.", time: "3 hours ago", unread: false, icon: ShieldAlert, color: "text-green-600 bg-green-50 dark:bg-green-900/30" },
    { id: "n4", type: "scheme", title: "New Subsidy Available", desc: "PM-Kisan 15th installment applications are now open.", time: "1 day ago", unread: false, icon: Landmark, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30" },
  ]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || { displayName: "Rajesh Kumar", photoURL: "" });
    });
    return () => unsubscribe();
  }, []);

  // Close notifications modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/auth" || pathname === "/auth/signup" || pathname === "/profile-setup") {
    return null;
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#16171f] border-b border-gray-100 dark:border-white/10 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Mobile Menu Trigger & Logo */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-extrabold text-green-700 dark:text-green-400 text-lg">AgroPulse</span>
        </Link>
      </div>

      {/* Screen Title (Desktop only) */}
      <div className="hidden md:block">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Workspace</span>
        <h1 className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">AgroPulse Hub</h1>
      </div>

      {/* Controls: Dark Mode, i18n, Notifs, Profile */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 bg-gray-50 dark:bg-white/10 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 border border-gray-100 dark:border-white/10 rounded-lg px-2.5 py-1.5 bg-gray-50 dark:bg-white/10">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:inline">{t("select_language") || "Lang"}:</span>
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="text-xs font-extrabold text-green-700 dark:text-green-400 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="bn">বাংলা</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2.5 bg-gray-50 dark:bg-white/10 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-xl relative transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#16171f]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-50 dark:border-white/5 flex justify-between items-center">
                <span className="text-xs font-extrabold text-gray-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] font-bold text-green-600 dark:text-green-400 hover:text-green-700">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div key={notif.id} className={`p-3.5 flex gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${notif.unread ? "bg-green-50/20 dark:bg-green-900/10" : ""}`}>
                      <div className={`p-2.5 rounded-xl ${notif.color} h-10 w-10 flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate pr-2">{notif.title}</h4>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 whitespace-nowrap font-medium">{notif.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-0.5">{notif.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <Link
          href="/profile"
          className="flex items-center gap-2 p-1 pr-3 bg-gray-50 dark:bg-white/10 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-100 dark:hover:border-green-800 border border-gray-100 dark:border-white/10 rounded-xl transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            {user?.displayName?.charAt(0) || "R"}
          </div>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 hidden sm:inline">{user?.displayName || "Rajesh"}</span>
        </Link>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden flex justify-start">
          <div className="w-64 bg-white dark:bg-[#16171f] h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-6 mt-8">
              <Link href="/" className="text-2xl font-extrabold text-green-700 dark:text-green-400 flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                <Logo className="w-9 h-9" />
                <span>AgroPulse</span>
              </Link>
              <nav className="space-y-2">
                {[
                  { href: "/", label: t("dashboard") || "Dashboard" },
                  { href: "/marketplace", label: "Buy Crops (Customer)" },
                  { href: "/seller", label: "Sell Crops (Farmer Desk)" },
                  { href: "/market", label: t("market_prices") || "Market Prices" },
                  { href: "/mandi-finder", label: t("mandi_finder") || "Mandi Finder" },
                  { href: "/weather", label: t("weather") || "Weather" },
                  { href: "/community", label: t("community") || "Community" },
                  { href: "/experts", label: t("expert_consultation") || "Experts" },
                  { href: "/planner", label: t("planner") || "Crop Planner" },
                  { href: "/compare", label: t("compare") || "Compare Crops" },
                  { href: "/schemes", label: t("govt_schemes") || "Govt Schemes" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-xs font-bold ${
                      pathname === link.href ? "bg-green-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
