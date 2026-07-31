"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, Sprout, Save, FileText, Settings, ShieldCheck, 
  Mail, Phone, Award, ShoppingBag, Edit3, Trash2, Star, CheckCircle2, MessageSquare, ExternalLink,
  Camera, Upload, Image as ImageIcon, UserCheck, X
} from "lucide-react";
import Link from "next/link";
import { UserFeedback } from "../feedback/page";

// CARTOON & VECTOR GENERATED DP AVATAR PRESETS
const CARTOON_DP_PRESETS = [
  { label: "Desi Farmer 👨‍🌾", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=DesiKisan&backgroundColor=b6e3f4" },
  { label: "Kisan Girl 👩‍🌾", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=KisanKanya&backgroundColor=c0aede" },
  { label: "Agri Leader 🌾", url: "https://api.dicebear.com/7.x/big-smile/svg?seed=AgriMaster&backgroundColor=ffd5dc" },
  { label: "Mandi Trader 👳‍♂️", url: "https://api.dicebear.com/7.x/bottts/svg?seed=MandiTrader&backgroundColor=d1d4f9" },
  { label: "Smart Kisan 🤖", url: "https://api.dicebear.com/7.x/micah/svg?seed=SmartKisan&backgroundColor=ffdfbf" }
];

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<"card" | "edit" | "feedbacks" | "orders">("card");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    fullName: "Rameshwar Patil",
    eFarmerId: "MH-FAR-89210",
    phone: "+91 98221 45678",
    email: "ramesh.patil@agrimail.in",
    state: "Maharashtra",
    district: "Pune",
    village: "Baramati",
    primaryCrop: "Wheat (Lokwan), Onion, Sugarcane",
    farmSize: "8.5 Acres",
    savingsGoal: "₹2,50,000 / year",
    verificationBadge: "Government APMC Verified",
    avatar: "" // Empty string represents WhatsApp-style Default Human Face Silhouette
  });

  const [myFeedbacks, setMyFeedbacks] = useState<UserFeedback[]>([]);
  const [editingFeedback, setEditingFeedback] = useState<UserFeedback | null>(null);
  const [savingMsg, setSavingMsg] = useState(false);

  useEffect(() => {
    // 1. Load saved e-Farmer Profile
    const savedUser = localStorage.getItem("agropulse_current_user_account");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setProfileData(prev => ({
          ...prev,
          fullName: parsed.fullName || prev.fullName,
          eFarmerId: parsed.eFarmerId || prev.eFarmerId,
          phone: parsed.phone || prev.phone,
          email: parsed.email || prev.email,
          state: parsed.state || prev.state,
          district: parsed.district || prev.district,
          village: parsed.village || prev.village,
          primaryCrop: parsed.primaryCrops?.[0] || prev.primaryCrop,
          farmSize: parsed.farmSize || prev.farmSize,
          savingsGoal: parsed.savingsGoal || prev.savingsGoal,
          avatar: parsed.avatar !== undefined ? parsed.avatar : prev.avatar
        }));
      } catch (e) { console.error(e); }
    }

    // 2. Load my feedbacks
    const savedFb = localStorage.getItem("agropulse_user_feedbacks");
    if (savedFb) {
      try {
        setMyFeedbacks(JSON.parse(savedFb));
      } catch (e) { console.error(e); }
    }
  }, []);

  // HANDLE CUSTOM DP FILE UPLOAD FROM DEVICE
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        const updated = { ...profileData, avatar: base64Url };
        setProfileData(updated);
        localStorage.setItem("agropulse_current_user_account", JSON.stringify({
          ...updated,
          primaryCrops: [updated.primaryCrop]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMsg(true);
    localStorage.setItem("agropulse_current_user_account", JSON.stringify({
      eFarmerId: profileData.eFarmerId,
      fullName: profileData.fullName,
      phone: profileData.phone,
      email: profileData.email,
      state: profileData.state,
      district: profileData.district,
      village: profileData.village,
      primaryCrops: [profileData.primaryCrop],
      farmSize: profileData.farmSize,
      savingsGoal: profileData.savingsGoal,
      avatar: profileData.avatar
    }));

    setTimeout(() => {
      setSavingMsg(false);
      alert("Profile & Display Picture (DP) saved successfully!");
      setActiveTab("card");
    }, 400);
  };

  const handleDeleteFeedback = (id: string) => {
    if (confirm("Are you sure you want to delete your feedback review?")) {
      const updated = myFeedbacks.filter(f => f.id !== id);
      setMyFeedbacks(updated);
      localStorage.setItem("agropulse_user_feedbacks", JSON.stringify(updated));
    }
  };

  const handleSaveEditedFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeedback) return;
    const updated = myFeedbacks.map(f => f.id === editingFeedback.id ? editingFeedback : f);
    setMyFeedbacks(updated);
    localStorage.setItem("agropulse_user_feedbacks", JSON.stringify(updated));
    setEditingFeedback(null);
  };

  // WHATSAPP-STYLE DEFAULT HUMAN SILHOUETTE COMPONENT
  const RenderUserDP = ({ size = "w-20 h-20", textSize = "text-3xl" }: { size?: string; textSize?: string }) => {
    if (profileData.avatar && profileData.avatar.trim() !== "") {
      return (
        <img 
          src={profileData.avatar} 
          alt={profileData.fullName}
          className={`${size} rounded-3xl object-cover border-4 border-green-400 shadow-xl`}
        />
      );
    }

    // WhatsApp-style default silhouette (clean gray/green human face)
    return (
      <div className={`${size} rounded-3xl bg-gray-200 dark:bg-gray-800 border-4 border-green-400 flex items-center justify-center text-gray-500 dark:text-gray-400 shadow-xl relative overflow-hidden`}>
        <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans max-w-6xl mx-auto space-y-8 pt-[78px]">
      
      {/* Hidden File Input for Custom DP Upload */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* SEPARATE PROFILE HEADER BANNER */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-green-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-green-700/40 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5 relative z-10">
          
          {/* PROFILE PICTURE (DP) DISPLAY & EDIT BADGE */}
          <div className="relative group">
            <RenderUserDP size="w-20 h-20" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-green-500 hover:bg-green-400 text-white p-2 rounded-xl shadow-lg border border-white transition-transform group-hover:scale-110"
              title="Change Profile Picture (DP)"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="bg-green-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {profileData.verificationBadge}
              </span>
              <span className="bg-white/20 text-green-200 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                🆔 {profileData.eFarmerId}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              {profileData.fullName}
            </h1>
            <p className="text-xs text-green-200 font-bold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-green-400" /> {profileData.village}, {profileData.district}, {profileData.state}
            </p>
          </div>
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

      {/* SEPARATE NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-white/10 text-xs font-black">
        <button
          onClick={() => setActiveTab("card")}
          className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === "card"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white dark:bg-[#1a1b23] text-gray-600 dark:text-gray-400 hover:bg-green-50"
          }`}
        >
          <Award className="w-4 h-4" /> e-Farmer Identity Card
        </button>

        <button
          onClick={() => setActiveTab("edit")}
          className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === "edit"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white dark:bg-[#1a1b23] text-gray-600 dark:text-gray-400 hover:bg-green-50"
          }`}
        >
          <Edit3 className="w-4 h-4" /> Edit Profile & Cartoon DP
        </button>

        <button
          onClick={() => setActiveTab("feedbacks")}
          className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === "feedbacks"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white dark:bg-[#1a1b23] text-gray-600 dark:text-gray-400 hover:bg-green-50"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> My Reviews & Feedbacks ({myFeedbacks.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 ${
            activeTab === "orders"
              ? "bg-green-600 text-white shadow-md"
              : "bg-white dark:bg-[#1a1b23] text-gray-600 dark:text-gray-400 hover:bg-green-50"
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Orders & Sales Desk
        </button>
      </div>

      {/* TAB 1: E-FARMER IDENTITY CARD */}
      {activeTab === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* DIGITAL PASSPORT BADGE WITH WHATSAPP-STYLE SILHOUETTE OR CARTOON DP */}
          <div className="md:col-span-1 bg-gradient-to-br from-green-800 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-xl border border-green-600 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/20">
                <span className="text-[10px] font-black uppercase text-green-300">Govt e-Kisan Identity Card</span>
                <ShieldCheck className="w-5 h-5 text-green-400" />
              </div>

              <div className="text-center space-y-3">
                <div className="relative w-24 h-24 mx-auto group">
                  <RenderUserDP size="w-24 h-24" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-xl shadow-lg border border-white"
                    title="Upload New DP"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-white">{profileData.fullName}</h3>
                  <span className="inline-block bg-black/40 text-green-300 px-3 py-1 rounded-xl text-xs font-black tracking-wider border border-white/10 mt-1">
                    {profileData.eFarmerId}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-white/20 pt-4">
              <div className="flex justify-between">
                <span className="text-green-200">Phone:</span>
                <span className="font-bold text-white">{profileData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">District:</span>
                <span className="font-bold text-white">{profileData.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-200">State:</span>
                <span className="font-bold text-white">{profileData.state}</span>
              </div>
            </div>
          </div>

          {/* FARM DETAILS SUMMARY & QUICK EDIT BUTTON */}
          <div className="md:col-span-2 bg-white dark:bg-[#1a1b23] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/10 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                Agricultural Land & Crop Profile
              </h3>
              <button 
                onClick={() => setActiveTab("edit")}
                className="px-3.5 py-1.5 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 font-extrabold text-xs rounded-xl border border-green-300 dark:border-green-800 flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile & DP
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-1">
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Land Holding Size</span>
                <span className="font-black text-base text-green-600 dark:text-green-400">{profileData.farmSize}</span>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-1">
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Est. Annual Net Target</span>
                <span className="font-black text-base text-green-600 dark:text-green-400">{profileData.savingsGoal}</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-1 text-xs">
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Primary Crops Cultivated</span>
              <span className="font-extrabold text-gray-900 dark:text-white text-sm">{profileData.primaryCrop}</span>
            </div>

            <div className="pt-2 flex gap-3">
              <button onClick={() => setActiveTab("edit")} className="px-5 py-2.5 bg-green-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit Profile & DP Options
              </button>
              <Link href="/community" className="px-5 py-2.5 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl">
                Open Community Chat
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PROFILE & CARTOON DP / WHATSAPP SILHOUETTE */}
      {activeTab === "edit" && (
        <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-white/10 max-w-2xl mx-auto space-y-6">
          <h3 className="text-base font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 pb-3">
            Edit Account Profile & Profile Picture (DP)
          </h3>

          {/* PROFILE PICTURE (DP) SELECTION / UPLOAD SECTION */}
          <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-200/60 dark:border-white/5 space-y-4">
            <label className="block font-black text-xs text-gray-900 dark:text-white uppercase tracking-wider">
              Profile Display Picture (DP) Style:
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <RenderUserDP size="w-20 h-20" />

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Custom Photo
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileData({ ...profileData, avatar: "" })}
                    className="px-3.5 py-2 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" /> WhatsApp Default Silhouette (No DP)
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">Upload custom photo or reset to classic human face silhouette.</p>
              </div>
            </div>

            {/* CARTOON / VECTOR GENERATED DP PRESETS */}
            <div className="pt-2 border-t border-gray-200/60 dark:border-white/10">
              <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 block mb-2.5">
                🎨 Cartoon & Vector DP Presets:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {CARTOON_DP_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProfileData({ ...profileData, avatar: preset.url })}
                    className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 bg-white dark:bg-[#16171f] ${
                      profileData.avatar === preset.url ? "border-green-500 ring-2 ring-green-500/30 scale-105 shadow-md" : "border-gray-200 dark:border-white/10 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-12 h-12 rounded-xl object-contain bg-gray-50" />
                    <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 truncate w-full text-center">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name:</label>
              <input
                type="text"
                required
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number:</label>
              <input
                type="tel"
                required
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">State:</label>
                <input
                  type="text"
                  required
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">District:</label>
                <input
                  type="text"
                  required
                  value={profileData.district}
                  onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">🌾 Land Holding Size:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8.5 Acres"
                  value={profileData.farmSize}
                  onChange={(e) => setProfileData({ ...profileData, farmSize: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">💰 Est. Yearly Revenue Target:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹2,50,000 / year"
                  value={profileData.savingsGoal}
                  onChange={(e) => setProfileData({ ...profileData, savingsGoal: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Primary Crops Cultivated:</label>
              <input
                type="text"
                required
                value={profileData.primaryCrop}
                onChange={(e) => setProfileData({ ...profileData, primaryCrop: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={savingMsg}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Profile Details & DP
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MY SUBMITTED FEEDBACKS WITH EDIT & DELETE */}
      {activeTab === "feedbacks" && (
        <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                My Submitted Feedback & Reviews ({myFeedbacks.length})
              </h3>
              <p className="text-xs text-gray-500 font-medium">You can Edit or Delete any review you submitted.</p>
            </div>

            <Link href="/feedback" className="px-4 py-2 bg-green-600 text-white font-extrabold text-xs rounded-xl shadow-sm">
              + New Feedback
            </Link>
          </div>

          {myFeedbacks.length === 0 ? (
            <div className="text-center text-gray-400 py-12 space-y-2">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs font-bold">You haven't submitted any feedback reviews yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myFeedbacks.map((fb) => (
                <div key={fb.id} className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200/60 dark:border-white/5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(fb.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400" />
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingFeedback(fb)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit Feedback"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteFeedback(fb.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Feedback"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-800 dark:text-gray-200 font-medium italic">
                      "{fb.comments}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 dark:border-white/5 flex justify-between items-center text-[10px] text-gray-400 font-bold">
                    <span>{fb.category}</span>
                    <span>{fb.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ORDERS & SALES DESK */}
      {activeTab === "orders" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/10 space-y-3">
            <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" /> My Customer Purchase Orders
            </h3>
            <p className="text-xs text-gray-500 font-medium">View active crop purchases, invoice downloads, and order cancellation filters.</p>
            <Link href="/marketplace" className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-sm">
              Open Buyer Marketplace <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/10 space-y-3">
            <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sprout className="w-4 h-4 text-amber-600" /> My Farmer Selling Desk
            </h3>
            <p className="text-xs text-gray-500 font-medium">List harvested crops online and approve or dispatch incoming customer orders.</p>
            <Link href="/seller" className="inline-flex items-center gap-1 px-4 py-2 bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-sm">
              Open Farmer Desk <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* EDIT FEEDBACK MODAL */}
      {editingFeedback && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
              <h3 className="text-base font-black text-gray-900 dark:text-white">Edit Review</h3>
              <button onClick={() => setEditingFeedback(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedFeedback} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Rating:</label>
                <div className="flex gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setEditingFeedback({ ...editingFeedback, rating: star })}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${star <= editingFeedback.rating ? "fill-yellow-400" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Comments:</label>
                <textarea
                  rows={4}
                  value={editingFeedback.comments}
                  onChange={(e) => setEditingFeedback({ ...editingFeedback, comments: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingFeedback(null)} className="w-1/2 py-2 bg-gray-200 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-green-600 text-white font-extrabold rounded-xl shadow-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
