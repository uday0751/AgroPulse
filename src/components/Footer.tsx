"use client";

import Link from "next/link";
import { 
  Sprout, Mail, User, Phone, MapPin, Heart, ShieldCheck, 
  ExternalLink, Sparkles, MessageSquare, Globe, ArrowUpRight
} from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#12131a] border-t-2 border-gray-200 dark:border-white/15 mt-12 py-10 px-4 md:px-8 text-gray-700 dark:text-gray-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP SECTION: PLATFORM BRAND & DEVELOPER INFO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* COLUMN 1: BRAND & VISION */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 text-2xl font-black text-green-700 dark:text-green-400">
              <Logo className="w-8 h-8" />
              <span>AgroPulse</span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              India's premier digital agriculture & direct farm-to-buyer trading ecosystem. Connecting e-Farmers across 36 States & UTs.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-950/80 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> APMC Verified Portal
              </span>
            </div>
          </div>

          {/* COLUMN 2: DEVELOPER & CONTACT INFO (UDAY PRATAP SINGH CHAUHAN) */}
          <div className="md:col-span-1 space-y-3 bg-gradient-to-br from-green-50 via-emerald-50/40 to-teal-50/30 dark:from-green-950/40 dark:via-emerald-950/20 dark:to-teal-950/20 p-4 rounded-2xl border border-green-200/70 dark:border-green-800/60 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-green-800 dark:text-green-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-green-600" /> Founder & Developer
            </h4>
            <div className="space-y-1.5 text-xs">
              <p className="font-extrabold text-gray-900 dark:text-white text-sm">
                Uday Pratap Singh Chauhan
              </p>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold">
                <Mail className="w-4 h-4 text-green-600 shrink-0" />
                <a 
                  href="mailto:udchauhan0987@gmail.com" 
                  className="hover:text-green-600 underline dark:hover:text-green-400 transition-colors"
                >
                  udchauhan0987@gmail.com
                </a>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Lead Engineer & Architect of AgroPulse Agriculture Platform.
              </p>
            </div>
          </div>

          {/* COLUMN 3: QUICK NAVIGATION */}
          <div className="space-y-2 text-xs">
            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-xs">
              Platform Solutions
            </h4>
            <ul className="space-y-1.5 font-bold text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/marketplace" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  🛒 Buy Crops (Direct Customer)
                </Link>
              </li>
              <li>
                <Link href="/seller" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  🌾 Sell Crops (Farmer Desk)
                </Link>
              </li>
              <li>
                <Link href="/mandi-finder" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  📍 Real-Time Mandi Finder
                </Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  🌧️ 60-Day Satellite Weather
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  💬 e-Farmer Verified Community
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-green-600 dark:hover:text-green-400 text-green-700 dark:text-green-400 underline font-extrabold">
                  ⭐ Submit User Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: GOVERNMENT HELPLINES & SUPPORT */}
          <div className="space-y-2 text-xs">
            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-xs">
              Kisan Support Helplines
            </h4>
            <div className="space-y-2 font-medium text-gray-600 dark:text-gray-400">
              <div className="bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl border border-gray-100 dark:border-white/5 space-y-1">
                <span className="font-extrabold text-gray-900 dark:text-white block text-[11px]">📞 Govt Kisan Call Centre</span>
                <span className="font-black text-green-700 dark:text-green-400 text-sm">1800-180-1551</span>
                <span className="text-[10px] text-gray-400 block">(Toll-Free 24x7 Support)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Direct integration with e-NAM, Agmarknet & Ministry of Agriculture & Farmers Welfare India.
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & CREATOR BAR */}
        <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
          <div>
            © {new Date().getFullYear()} <span className="text-gray-900 dark:text-white font-extrabold">AgroPulse</span>. Created & Developed by <span className="text-green-700 dark:text-green-400 font-extrabold">Uday Pratap Singh Chauhan</span> (<a href="mailto:udchauhan0987@gmail.com" className="underline hover:text-green-600">udchauhan0987@gmail.com</a>).
          </div>

          <div className="flex items-center gap-4">
            <Link href="/feedback" className="hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-green-600" /> Give Feedback
            </Link>
            <span>•</span>
            <Link href="/schemes" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Govt Schemes
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
