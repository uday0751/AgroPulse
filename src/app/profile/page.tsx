"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Sprout, Save, FileText, Settings, BadgePercent } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Rajesh Kumar",
    state: "Maharashtra",
    district: "Pune",
    primaryCrop: "Wheat",
    farmSize: "5 Acres",
    savingsGoal: "₹1,50,000",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(true);
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data() as any);
          } else {
            // Write initial state to firestore
            await setDoc(docRef, profileData);
          }
        } catch (e) {
          console.warn("Firestore fetch error, utilizing default client-side profiles.", e);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setSaving(true);
    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        ...profileData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      alert("Profile saved successfully!");
    } catch (e) {
      console.error("Firestore save error", e);
      alert("Error saving profile to database. Saved to local state.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
          My Farmer Profile
        </h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">Manage your crop data, location, and account details</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center flex flex-col items-center justify-between">
          <div className="w-full">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-green-50 flex items-center justify-center border-2 border-green-500 text-green-700 font-bold text-3xl">
                {profileData.fullName.charAt(0)}
              </div>
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">{profileData.fullName}</h3>
            <p className="text-xs text-gray-400 font-semibold mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {profileData.district}, {profileData.state}
            </p>
          </div>

          <div className="w-full border-t border-gray-50 mt-6 pt-6 space-y-3 text-xs font-semibold text-gray-500 text-left">
            <div className="flex justify-between">
              <span>Primary Crop:</span>
              <span className="text-gray-900 font-bold">{profileData.primaryCrop}</span>
            </div>
            <div className="flex justify-between">
              <span>Farm Size:</span>
              <span className="text-gray-900 font-bold">{profileData.farmSize}</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Annual Net:</span>
              <span className="text-gray-900 font-bold">{profileData.savingsGoal}</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-50">Account Details</h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  className="block w-full pl-9 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={profileData.state}
                  onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  required
                  value={profileData.district}
                  onChange={(e) => setProfileData({...profileData, district: e.target.value})}
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Crop</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Sprout className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={profileData.primaryCrop}
                    onChange={(e) => setProfileData({...profileData, primaryCrop: e.target.value})}
                    className="block w-full pl-9 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Farm Size</label>
                <input
                  type="text"
                  required
                  value={profileData.farmSize}
                  onChange={(e) => setProfileData({...profileData, farmSize: e.target.value})}
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Profile Details"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
