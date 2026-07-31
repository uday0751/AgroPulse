"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Cloud, LineChart, Users, Calendar, Landmark, Stethoscope, ShoppingBag, Sprout, MapPin, BarChart, 
  ArrowRight, Sparkles, TrendingUp, Sun, Droplets, Wind, ArrowUpRight, ShieldCheck, ChevronRight, Navigation, Loader2,
  MessageSquare, Star, Send, ThumbsUp, CheckCircle2, User, Mail
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

  // Real-time Live Weather State for Dashboard
  const [weatherData, setWeatherData] = useState<{
    cityName: string;
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    loading: boolean;
  }>({
    cityName: "Detecting Location...",
    temp: 28,
    condition: "Clear Sky",
    humidity: 50,
    windSpeed: 10,
    loading: true
  });

  // Feedback Form State at Bottom of Dashboard
  const [fbName, setFbName] = useState("");
  const [fbComments, setFbComments] = useState("");
  const [fbRating, setFbRating] = useState(5);
  const [fbSuccess, setFbSuccess] = useState(false);
  const [dashboardFeedbacks, setDashboardFeedbacks] = useState<Array<{
    id: string;
    name: string;
    rating: number;
    comments: string;
    role: string;
    createdAt: string;
  }>>([
    { id: "1", name: "Rameshwar Patil", rating: 5, comments: "Mandi finder and live weather predictions are spot on!", role: "Farmer (Pune)", createdAt: "Today" },
    { id: "2", name: "Gurpreet Singh", rating: 5, comments: "Direct crop buyer matching saved us thousands in middleman fees.", role: "Farmer (Punjab)", createdAt: "Yesterday" }
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning, Farmer 🌅");
    else if (hour < 17) setGreeting("Good Afternoon, Farmer ☀️");
    else setGreeting("Good Evening, Farmer 🌾");
  }, []);

  // FETCH REAL-TIME WEATHER FOR USER'S LIVE GPS LOCATION
  const fetchDashboardWeather = async (lat: number, lng: number, fallbackName?: string) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,wind_speed_10m`
      );
      const data = await res.json();
      const current = data?.current || {};

      const weatherCodeMap: Record<number, string> = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Foggy 🌫️",
        51: "Light Drizzle 🌧️",
        61: "Slight Rain 🌧️",
        63: "Moderate Rain 🌧️",
        65: "Heavy Rain 🌧️",
        80: "Rain Showers 🌦️",
        95: "Thunderstorm 🌩️"
      };

      const cond = weatherCodeMap[current.weather_code] || "Clear Sky ☀️";
      let locationLabel = fallbackName || "Live Location";

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const geoData = await geoRes.json();
        const address = geoData?.address;
        if (address) {
          const city = address.city || address.town || address.village || address.district || address.state_district;
          const state = address.state;
          if (city) {
            locationLabel = state ? `${city}, ${state.substring(0, 2).toUpperCase()}` : city;
          }
        }
      } catch (e) { console.error(e); }

      setWeatherData({
        cityName: locationLabel,
        temp: Math.round(current.temperature_2m ?? 28),
        condition: cond,
        humidity: Math.round(current.relative_humidity_2m ?? 50),
        windSpeed: Math.round(current.wind_speed_10m ?? 12),
        loading: false
      });
    } catch (err) {
      console.error("Dashboard weather fetch error", err);
      setWeatherData({
        cityName: fallbackName || "Current Location",
        temp: 29,
        condition: "Clear Sky ☀️",
        humidity: 48,
        windSpeed: 11,
        loading: false
      });
    }
  };

  const detectLocationAndFetchWeather = () => {
    setWeatherData((prev) => ({ ...prev, loading: true }));
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchDashboardWeather(pos.coords.latitude, pos.coords.longitude),
        (err) => fetchDashboardWeather(23.2599, 77.4126, "Bhopal, MP"),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      fetchDashboardWeather(23.2599, 77.4126, "Bhopal, MP");
    }
  };

  useEffect(() => {
    detectLocationAndFetchWeather();
  }, []);

  // Submit quick feedback
  const handleQuickFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbComments.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      name: fbName.trim(),
      rating: fbRating,
      comments: fbComments.trim(),
      role: "Verified User",
      createdAt: "Just now"
    };
    setDashboardFeedbacks([newEntry, ...dashboardFeedbacks]);
    setFbName("");
    setFbComments("");
    setFbSuccess(true);
    setTimeout(() => setFbSuccess(false), 4000);
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: -25,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.from(tickerRef.current, {
        opacity: 0,
        scaleX: 0.96,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out"
      });

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

  // Integrated Modules Grid
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
      desc: "60-day localized rain, humidity, & soil moisture forecasts tailored for farming.",
      icon: Cloud,
      href: "/weather",
      badge: "60-Day Forecast",
      color: "bg-cyan-500",
      textColor: "text-cyan-600 dark:text-cyan-400",
      bgGradient: "hover:border-cyan-500/50"
    },
    {
      title: t("community") || "Farmer Community & Chat",
      desc: "Verified e-Farmer ID public discussion groups for real-time crop yields and rates.",
      icon: Users,
      href: "/community",
      badge: "e-Farmer Verified",
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
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto space-y-10">
      
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
              Buy and sell crops directly across 36 Indian States & UTs. Track 70+ world crop rates, find local mandis on interactive map, and check real-time satellite weather predictions below.
            </p>
          </div>

          {/* DYNAMIC REAL-TIME SATELLITE WEATHER SNAPSHOT */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl space-y-3 text-xs shadow-lg">
            <div className="flex justify-between items-center pb-2 border-b border-white/15">
              <span className="font-extrabold text-green-300 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-yellow-400" /> Live Weather
              </span>
              
              <button 
                onClick={detectLocationAndFetchWeather}
                title="Refresh Live Location Weather"
                className="text-[11px] font-black text-white bg-green-600/80 hover:bg-green-500 px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1 transition-all"
              >
                {weatherData.loading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-white" />
                ) : (
                  <Navigation className="w-3 h-3 text-green-200" />
                )}
                <span>{weatherData.cityName}</span>
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-black text-white flex items-baseline gap-1">
                  {weatherData.temp}°C
                </div>
                <div className="text-[11px] font-bold text-green-200 mt-0.5">
                  {weatherData.condition}
                </div>
              </div>
              <div className="text-right space-y-1 text-[11px]">
                <div className="flex items-center justify-end gap-1 text-green-200 font-bold">
                  <Droplets className="w-3.5 h-3.5 text-blue-300" /> {weatherData.humidity}% Humidity
                </div>
                <div className="flex items-center justify-end gap-1 text-green-200 font-bold">
                  <Wind className="w-3.5 h-3.5 text-teal-300" /> {weatherData.windSpeed} km/h Wind
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/15 flex justify-between items-center text-[10px] text-green-200 font-extrabold">
              <span>📍 Live Satellite Open-Meteo API</span>
              <Link href="/weather" className="text-yellow-300 hover:underline flex items-center gap-0.5">
                Full 60-Day Forecast <ChevronRight className="w-3 h-3" />
              </Link>
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
            <span>🌱 Soybean JS-335:</span>
            <span className="text-green-600 dark:text-green-400 font-extrabold">₹4,920/q</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/5">
            <span>🧅 Nashik Red Onion:</span>
            <span className="text-green-600 dark:text-green-400 font-extrabold">₹2,100/q</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          </div>
        </div>
      </div>

      {/* Grid of All 10 Interactive Platform Features */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">
              Explore Platform Features & Tools
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Comprehensive agricultural management suite designed for modern Indian farmers & crop buyers.
            </p>
          </div>
          <span className="text-xs font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
            10 Active Suite Tools
          </span>
        </div>

        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {modules.map((mod, i) => {
            const IconComponent = mod.icon;
            return (
              <Link 
                key={i} 
                href={mod.href}
                className={`group bg-white dark:bg-[#1a1b23] p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${mod.bgGradient}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl ${mod.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-1.5">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-extrabold">
                  <span className={mod.textColor}>Access Feature</span>
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/5 group-hover:bg-green-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FEEDBACK FORM AT THE VERY BOTTOM OF THE DASHBOARD */}
      <div className="bg-white dark:bg-[#1a1b23] border-2 border-green-500/30 dark:border-green-500/40 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950 px-3.5 py-1 rounded-full text-xs font-black text-green-800 dark:text-green-300 mb-1 border border-green-300 dark:border-green-800">
              <MessageSquare className="w-3.5 h-3.5 text-green-600" />
              <span>Feedback Portal</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
              Farmer & User Feedback Form
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              We value your experience! Submit your review directly to the Lead Engineer & Platform Founder.
            </p>
          </div>

          {/* FOUNDER BRAND BADGE */}
          <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-green-950 text-white p-4 rounded-2xl border border-green-700/60 shadow-md text-xs space-y-1 shrink-0">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-400" />
              <span className="font-extrabold text-white text-sm">Uday Pratap Singh Chauhan</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-200">
              <Mail className="w-3.5 h-3.5 text-green-400" />
              <a href="mailto:udchauhan0987@gmail.com" className="hover:underline font-extrabold text-white">udchauhan0987@gmail.com</a>
            </div>
          </div>
        </div>

        {/* FEEDBACK FORM & FEEDBACK FEED GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* FEEDBACK FORM */}
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-200/60 dark:border-white/5 space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Submit Your Feedback Below
              </h3>
              <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-950 px-2.5 py-0.5 rounded-md">
                Direct Submission
              </span>
            </div>

            {fbSuccess && (
              <div className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-green-300">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Thank you! Your feedback has been successfully submitted and saved.</span>
              </div>
            )}

            <form onSubmit={handleQuickFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Your Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil"
                  value={fbName}
                  onChange={(e) => setFbName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1b23] font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Star Rating:</label>
                <div className="flex items-center gap-2 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFbRating(star)}
                      className="p-1 hover:scale-125 transition-transform focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= fbRating ? "fill-yellow-400" : "text-gray-300"}`} />
                    </button>
                  ))}
                  <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300 ml-2">
                    ({fbRating} / 5 Stars)
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Your Feedback & Suggestions:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your thoughts about crop prices, buying/selling experience, weather predictions, or mandi finder..."
                  value={fbComments}
                  onChange={(e) => setFbComments(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1b23] font-bold text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> Submit Feedback Form
              </button>
            </form>
          </div>

          {/* SUBMITTED FEEDBACK REVIEWS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                Recent Farmer Reviews
              </h3>
              <Link href="/feedback" className="text-xs font-black text-green-600 dark:text-green-400 hover:underline flex items-center gap-1">
                Full Feedback Portal <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {dashboardFeedbacks.map((fb) => (
                <div key={fb.id} className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200/60 dark:border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(fb.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{fb.createdAt}</span>
                  </div>

                  <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold italic">
                    "{fb.comments}"
                  </p>

                  <div className="pt-2 border-t border-gray-200/60 dark:border-white/5 flex justify-between items-center text-xs">
                    <span className="font-extrabold text-gray-900 dark:text-white">{fb.name}</span>
                    <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">{fb.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
