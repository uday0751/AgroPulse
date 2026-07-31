"use client";

import { useState, useEffect } from "react";
import { 
  Star, MessageSquare, Send, CheckCircle2, User, Mail, ShieldCheck, 
  ThumbsUp, Sparkles, MapPin, Tag, HeartHandshake, PhoneCall
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface UserFeedback {
  id: string;
  name: string;
  email: string;
  role: "Farmer" | "Crop Buyer" | "Trader" | "Agronomist";
  category: "Mandi Finder" | "Crop Marketplace" | "Weather Forecast" | "Community Chat" | "Overall Platform";
  rating: number;
  comments: string;
  location: string;
  createdAt: string;
}

const INITIAL_FEEDBACKS: UserFeedback[] = [
  {
    id: "fb-1",
    name: "Rameshwar Patil",
    email: "ramesh.patil@agrimail.in",
    role: "Farmer",
    category: "Mandi Finder",
    rating: 5,
    comments: "The GPS Mandi Finder with Haversine distance is incredible! Found Bhopal Karond APMC mandi rates immediately.",
    location: "Baramati, Pune",
    createdAt: "31 July 2026"
  },
  {
    id: "fb-2",
    name: "Gurpreet Singh",
    email: "gurpreet.pb@kisanmail.in",
    role: "Farmer",
    category: "Crop Marketplace",
    rating: 5,
    comments: "Direct crop selling with manual quantity options and order cancellation filtering made selling Basmati 1121 super easy.",
    location: "Ludhiana, Punjab",
    createdAt: "30 July 2026"
  },
  {
    id: "fb-3",
    name: "Devendra Dhakad",
    email: "devendra.mp@farmershub.in",
    role: "Trader",
    category: "Weather Forecast",
    rating: 5,
    comments: "The 60-day weather prediction graph with soil moisture tracking (78%) helped us plan crop harvesting perfectly.",
    location: "Bhopal, Madhya Pradesh",
    createdAt: "29 July 2026"
  }
];

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>(INITIAL_FEEDBACKS);
  
  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<UserFeedback["category"]>("Overall Platform");
  const [role, setRole] = useState<UserFeedback["role"]>("Farmer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Pune, Maharashtra");
  const [comments, setComments] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  // Load saved feedbacks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("agropulse_user_feedbacks");
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comments.trim()) {
      alert("Please fill in your name and comments before submitting feedback.");
      return;
    }

    const newFb: UserFeedback = {
      id: `fb-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || "anonymous@agropulse.in",
      role,
      category,
      rating,
      comments: comments.trim(),
      location: location.trim() || "India",
      createdAt: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [newFb, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem("agropulse_user_feedbacks", JSON.stringify(updated));

    setName("");
    setEmail("");
    setComments("");
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans max-w-7xl mx-auto space-y-8 pt-[78px]">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-800 to-green-950 text-white rounded-3xl p-6 md:p-10 shadow-xl border border-green-700/40 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-green-300 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Community Voice & Support</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Farmer Feedback & Portal Reviews
          </h1>

          <p className="text-green-100/90 text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
            Your insights drive AgroPulse forward! Rate your experience with our Mandi Finder, Crop Marketplace, 60-Day Weather Prediction, and e-Farmer Verified Chat.
          </p>
        </div>
      </div>

      {/* Main Grid: Feedback Form + Founder Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLUMNS: SUBMIT FEEDBACK FORM */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" /> Submit Your Feedback & Rating
              </h2>
              <p className="text-xs text-gray-500 font-medium">We appreciate every review from farmers, buyers, and agronomists.</p>
            </div>
            <span className="text-xs font-black text-green-600 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
              ⭐ 4.9 / 5 Rating
            </span>
          </div>

          <AnimatePresence>
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 dark:bg-green-950/60 border border-green-300 dark:border-green-800 p-4 rounded-2xl text-green-800 dark:text-green-300 text-xs font-bold flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>Thank you! Your feedback has been submitted successfully and posted below.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmitFeedback} className="space-y-5 text-xs">
            {/* STAR RATING SELECTOR */}
            <div>
              <label className="block font-black text-gray-700 dark:text-gray-300 mb-2">
                Overall Experience Rating:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star 
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-700"
                      }`}
                    />
                  </button>
                ))}
                <span className="font-extrabold text-sm text-yellow-600 dark:text-yellow-400 ml-2">
                  {rating === 5 ? "⭐⭐⭐⭐⭐ Excellent" : rating === 4 ? "⭐⭐⭐⭐ Very Good" : rating === 3 ? "⭐⭐⭐ Good" : "⭐⭐ Average"}
                </span>
              </div>
            </div>

            {/* CATEGORY & ROLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-gray-700 dark:text-gray-300 mb-1.5">Feature Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                >
                  <option value="Overall Platform">Overall Platform</option>
                  <option value="Mandi Finder">Mandi Finder & Rates</option>
                  <option value="Crop Marketplace">Crop Marketplace (Buy/Sell)</option>
                  <option value="Weather Forecast">60-Day Satellite Weather</option>
                  <option value="Community Chat">e-Farmer Verified Chat</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-gray-700 dark:text-gray-300 mb-1.5">Your User Role:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                >
                  <option value="Farmer">🌾 Farmer / Crop Cultivator</option>
                  <option value="Crop Buyer">🛒 Crop Buyer / Customer</option>
                  <option value="Trader">📈 APMC Mandi Trader</option>
                  <option value="Agronomist">🔬 Agronomist / Expert</option>
                </select>
              </div>
            </div>

            {/* NAME & EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-gray-700 dark:text-gray-300 mb-1.5">Your Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-black text-gray-700 dark:text-gray-300 mb-1.5">Email Address:</label>
                <input
                  type="email"
                  placeholder="e.g. farmer@agropulse.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* LOCATION & COMMENTS */}
            <div>
              <label className="block font-black text-gray-700 dark:text-gray-300 mb-1.5">District & State:</label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-black text-gray-700 dark:text-gray-300 mb-1.5">Your Detailed Feedback & Suggestions:</label>
              <textarea
                required
                rows={4}
                placeholder="Share your thoughts about mandi rates, crop buying/selling, weather accuracy, or community chat..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Feedback & Review
            </button>
          </form>
        </div>

        {/* RIGHT 1 COLUMN: FOUNDER CARD (UDAY PRATAP SINGH CHAUHAN) */}
        <div className="space-y-6">
          
          {/* FOUNDER CARD */}
          <div className="bg-gradient-to-br from-green-900 via-emerald-900 to-green-950 text-white rounded-3xl p-6 shadow-xl border border-green-700/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-green-400 flex items-center justify-center font-black text-2xl text-white shadow-md">
                U
              </div>
              <div>
                <span className="bg-green-500/20 text-green-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-green-400/30">
                  Platform Architect
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  Uday Pratap Singh Chauhan
                </h3>
                <p className="text-[11px] text-green-200 font-bold">
                  Founder & Lead Developer
                </p>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-green-300 font-extrabold">
                <Mail className="w-4 h-4 text-green-400" />
                <a href="mailto:udchauhan0987@gmail.com" className="hover:underline text-white font-black">
                  udchauhan0987@gmail.com
                </a>
              </div>
              <p className="text-[11px] text-gray-300 font-medium">
                Feel free to reach out directly for feature requests, agricultural partnerships, or technical inquiries.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-black text-green-200">
              <span>📍 AgroPulse Platform India</span>
              <span>24x7 Direct Contact</span>
            </div>
          </div>

          {/* COMMUNITY TESTIMONIAL METRICS */}
          <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/10 space-y-3 text-xs">
            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-green-600" /> Portal Feedback Stats
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                <span className="text-xl font-black text-green-600 dark:text-green-400 block">4.9 / 5</span>
                <span className="text-[10px] text-gray-400 font-bold">Average Satisfaction</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
                <span className="text-xl font-black text-green-600 dark:text-green-400 block">3,450+</span>
                <span className="text-[10px] text-gray-400 font-bold">Verified Reviews</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SUBMITTED FEEDBACK LIST */}
      <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-white/10 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-4">
          <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-green-600" /> Recent User Reviews & Feedback ({feedbacks.length})
          </h2>
          <span className="text-xs font-black text-green-600 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full">
            ● Real Farmers & Buyers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {feedbacks.map((fb) => (
            <div 
              key={fb.id} 
              className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-200/60 dark:border-white/5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
                    {fb.category}
                  </span>
                </div>

                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-relaxed italic">
                  "{fb.comments}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-200/60 dark:border-white/10 flex justify-between items-end">
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">{fb.name}</h4>
                  <span className="text-[10px] text-gray-400 font-semibold block">📍 {fb.location} • {fb.role}</span>
                </div>
                <span className="text-[9px] font-bold text-gray-400">{fb.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
