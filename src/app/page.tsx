"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Cloud, LineChart, Users, Calendar, Landmark, Stethoscope, ShoppingBag, Sprout, MapPin, BarChart, 
  ArrowRight, Sparkles, TrendingUp, Sun, Droplets, Wind, ArrowUpRight, ShieldCheck, ChevronRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import gsap from "gsap";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [greeting, setGreeting] = useState("Welcome to AgroPulse");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning, Farmer 🌅");
    else if (hour < 17) setGreeting("Good Afternoon, Farmer ☀️");
    else setGreeting("Good Evening, Farmer 🌾");
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(heroRef.current, {
        opacity: 0,
        y: -25,
        duration: 0.8,
        ease: "power3.out"
      });

      // Ticker animation
      gsap.from(tickerRef.current, {
        opacity: 0,
        scaleX: 0.96,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out"
      });

      // Cards staggered entry animation
      if (cardsContainerRef.current) {
        const cards = cardsContainerRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(1.2)",
            delay: 0.3
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Integrated Modules Grid including Buy Crops & Sell Crops alongside existing options
  const modules = [
    {
      title: "Buy Crops (Customer)",
      desc: "Buy fresh crops directly from farmers across 36 Indian States & UTs with 0% middleman fees.",
      icon: ShoppingBag,
      href: "/marketplace",
      badge: "🛒 Customer Hub",
      color: "bg-emerald-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgGradient: "hover:border-emerald-500 border-2 border-emerald-500/20"
    },
    {
      title: "Sell Crops (Farmer Desk)",
      desc: "List your harvested crop online and manually approve or dispatch incoming buyer orders.",
      icon: Sprout,
      href: "/seller",
      badge: "🌾 Farmer Desk",
      color: "bg-amber-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgGradient: "hover:border-amber-500 border-2 border-amber-500/20"
    },
    {
      title: t("market_prices") || "Market Prices & Analytics",
      desc: "Live Govt MSP vs Private rates for 70+ world crops with 6-month historical trend charts.",
      icon: LineChart,
      href: "/market",
      badge: "70+ World Crops",
      color: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
      bgGradient: "hover:border-green-500/50"
    },
    {
      title: t("mandi_finder") || "Real-Time Mandi Finder",
      desc: "Interactive Leaflet map showing 26+ mandis, crop prices, and GPS distance.",
      icon: MapPin,
      href: "/mandi-finder",
      badge: "GPS OpenStreetMap",
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      bgGradient: "hover:border-blue-500/50"
    },
    {
      title: t("weather") || "Weather Prediction",
      desc: "7-day localized rain, humidity, & wind forecasts tailored for farming.",
      icon: Cloud,
      href: "/weather",
      badge: "7-Day Forecast",
      color: "bg-cyan-500",
      textColor: "text-cyan-600 dark:text-cyan-400",
      bgGradient: "hover:border-cyan-500/50"
    },
    {
      title: t("community") || "Farmer Community & Chat",
      desc: "Share farming photos, discuss crop yields, and connect with local growers.",
      icon: Users,
      href: "/community",
      badge: "Active Forum",
      color: "bg-purple-500",
      textColor: "text-purple-600 dark:text-purple-400",
      bgGradient: "hover:border-purple-500/50"
    },
    {
      title: t("expert_consultation") || "Expert Consultation",
      desc: "Consult certified agronomists and genuine session experts for crop diseases.",
      icon: Stethoscope,
      href: "/experts",
      badge: "Agronomist 1-on-1",
      color: "bg-indigo-500",
      textColor: "text-indigo-600 dark:text-indigo-400",
      bgGradient: "hover:border-indigo-500/50"
    },
    {
      title: t("planner") || "Intelligent Crop Planner",
      desc: "Smart sowing schedules, fertilizer timings, and harvest cost calculators.",
      icon: Calendar,
      href: "/planner",
      badge: "AI Schedules",
      color: "bg-orange-500",
      textColor: "text-orange-600 dark:text-orange-400",
      bgGradient: "hover:border-orange-500/50"
    },
    {
      title: t("compare") || "Crop Comparison Tool",
      desc: "Compare profit margins, soil suitability, and water requirements side-by-side.",
      icon: BarChart,
      href: "/compare",
      badge: "Margin Analysis",
      color: "bg-teal-500",
      textColor: "text-teal-600 dark:text-teal-400",
      bgGradient: "hover:border-teal-500/50"
    },
    {
      title: t("govt_schemes") || "Government Schemes",
      desc: "PM-Kisan, Fasal Bima Yojana, subsidies, and low-interest agricultural loans.",
      icon: Landmark,
      href: "/schemes",
      badge: "Subsidies",
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      bgGradient: "hover:border-rose-500/50"
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto space-y-8">
      
      {/* Clean Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-green-500 animate-ping" />
            <span className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-widest">
              AgroPulse Ecosystem
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mt-1">
            Agricultural Portal Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-white/10 px-3.5 py-2 rounded-xl shadow-sm">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase">{t("select_language")}</span>
          <select 
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="text-xs font-extrabold text-green-700 dark:text-green-400 bg-transparent border-none focus:outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
      </div>

      {/* GSAP Animated Hero Banner */}
      <div 
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 via-emerald-800 to-green-950 p-6 md:p-10 text-white shadow-2xl border border-green-700/30"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-green-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>{greeting}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Smart Agriculture & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-teal-300">
                Direct Farm Trading Ecosystem
              </span>
            </h1>

            <p className="text-green-100/80 text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
              Buy and sell crops directly across 36 Indian States & UTs. Track 70+ world crop rates, find local mandis on interactive map, and check weather predictions below.
            </p>
          </div>

          {/* Quick Weather Snapshot */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/15">
              <span className="font-extrabold text-green-300 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-yellow-400" /> Today's Forecast
              </span>
              <span className="text-[11px] font-bold text-green-200">Pune, MH</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-black text-white">31°C</div>
                <div className="text-[10px] text-green-200">Sunny • Clear Sky</div>
              </div>
              <div className="text-right space-y-0.5 text-[11px]">
                <div className="flex items-center justify-end gap-1 text-green-200"><Droplets className="w-3 h-3" /> 45% Humidity</div>
                <div className="flex items-center justify-end gap-1 text-green-200"><Wind className="w-3 h-3" /> 12 km/h Wind</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Market Price Ticker */}
      <div 
        ref={tickerRef}
        className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-green-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Ticker
          </span>
          <span className="text-xs font-bold text-gray-900 dark:text-white">Trending Mandi Rates:</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto w-full scrollbar-none text-xs font-bold">
          <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/5">
            <span>🌾 Wheat Lokwan:</span>
            <span className="text-green-600 dark:text-green-400 font-extrabold">₹2,550/q</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/5">
            <span>🌾 Basmati 1121:</span>
            <span className="text-green-600 dark:text-green-400 font-extrabold">₹4,350/q</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/5">
            <span>🧅 Red Onion:</span>
            <span className="text-green-600 dark:text-green-400 font-extrabold">₹1,850/q</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/5">
            <span>🍅 Tomatoes:</span>
            <span className="text-green-600 dark:text-green-400 font-extrabold">₹1,500/q</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/5">
            <span>🥭 Alphonso:</span>
            <span className="text-green-600 dark:text-green-400 font-extrabold">₹17,500/q</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          </div>
        </div>
      </div>

      {/* ALL ECOSYSTEM MODULES GRID (INCLUDING BUY & SELL CROPS) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" /> Agricultural Services & Trading Hub
          </h2>
          <span className="text-xs text-gray-400 font-semibold">10 Integrated Services</span>
        </div>

        <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link href={mod.href} key={mod.title}>
                <div className={`bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm hover:shadow-xl ${mod.bgGradient} transition-all group cursor-pointer`}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${mod.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                        {mod.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-green-600 dark:text-green-400">
                    <span>Open Service</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
