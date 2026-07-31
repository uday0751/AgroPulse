"use client";

import { Home, LineChart, Cloud, Users, Calendar, Settings, Landmark, Stethoscope, User, MapPin, BarChart, ShoppingBag, Sprout, MessageSquareHeart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Hide sidebar on Auth and Profile-Setup pages
  if (pathname === "/auth" || pathname === "/auth/signup" || pathname === "/profile-setup") {
    return null;
  }

  const links = [
    { href: "/", label: t("dashboard") || "Dashboard", icon: Home },
    { href: "/marketplace", label: "Buy Crops (Customer)", icon: ShoppingBag },
    { href: "/seller", label: "Sell Crops (Farmer Desk)", icon: Sprout },
    { href: "/market", label: t("market_prices") || "Market Prices", icon: LineChart },
    { href: "/mandi-finder", label: t("mandi_finder") || "Mandi Finder", icon: MapPin },
    { href: "/weather", label: t("weather") || "Weather", icon: Cloud },
    { href: "/community", label: t("community") || "Community", icon: Users },
    { href: "/experts", label: t("expert_consultation") || "Experts", icon: Stethoscope },
    { href: "/planner", label: t("planner") || "Crop Planner", icon: Calendar },
    { href: "/compare", label: t("compare") || "Compare Crops", icon: BarChart },
    { href: "/schemes", label: t("govt_schemes") || "Govt Schemes", icon: Landmark },
    { href: "/feedback", label: "Feedback & Support", icon: MessageSquareHeart },
  ];

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white dark:bg-[#16171f] border-r-2 border-gray-200 dark:border-white/15 hidden md:flex flex-col min-h-screen fixed left-0 top-0 z-50 shadow-sm"
    >
      <div className="p-6 border-b-2 border-gray-200 dark:border-white/15 flex items-center justify-center">
        <Link href="/" className="text-2xl font-extrabold text-green-700 dark:text-green-400 flex items-center gap-2.5 tracking-tight">
          <Logo className="w-9 h-9" />
          <span>AgroPulse</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-xs font-bold border-2 ${
                isActive 
                  ? "bg-green-600 text-white border-green-600 shadow-md" 
                  : "bg-gray-50/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-green-500/80 hover:bg-green-50/60 dark:hover:bg-green-950/40 hover:text-green-700 dark:hover:text-green-400"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-gray-200 dark:border-white/15 space-y-2">
        <Link href="/profile" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
          pathname === "/profile" 
            ? "bg-green-600 text-white border-green-600 shadow-md" 
            : "bg-gray-50/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-green-500/80 hover:bg-green-50/60 dark:hover:bg-green-950/40 hover:text-green-700 dark:hover:text-green-400"
        }`}>
          <User className="w-4 h-4 shrink-0" />
          <span>{t("profile") || "Profile"}</span>
        </Link>

        <Link href="/settings" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
          pathname === "/settings" 
            ? "bg-green-600 text-white border-green-600 shadow-md" 
            : "bg-gray-50/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-green-500/80 hover:bg-green-50/60 dark:hover:bg-green-950/40 hover:text-green-700 dark:hover:text-green-400"
        }`}>
          <Settings className="w-4 h-4 shrink-0" />
          <span>{t("settings") || "Settings"}</span>
        </Link>
      </div>
    </motion.aside>
  );
}
