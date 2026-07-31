"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { User, MapPin, Sprout, ArrowRight } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfileSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    state: "",
    district: "",
    primaryCrop: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        // Pre-fill name if available from Google Auth
        if (user.displayName) {
          setFormData(prev => ({ ...prev, fullName: user.displayName! }));
        }
      } else {
        router.push("/auth");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        phoneNumber: currentUser.phoneNumber || "",
        email: currentUser.email || "",
        fullName: formData.fullName,
        state: formData.state,
        district: formData.district,
        primaryCrop: formData.primaryCrop,
        createdAt: new Date().toISOString(),
      });
      
      router.push("/");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          Tell us about your farm so we can personalize market prices and weather updates
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="block w-full pl-10 rounded-lg border-gray-300 px-4 py-3 text-gray-900 focus:ring-green-500 focus:border-green-500 sm:text-sm font-medium border"
                  placeholder="Rahul Kumar"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="block w-full pl-10 rounded-lg border-gray-300 px-4 py-3 text-gray-900 focus:ring-green-500 focus:border-green-500 sm:text-sm font-medium border"
                    placeholder="Maharashtra"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 focus:ring-green-500 focus:border-green-500 sm:text-sm font-medium border"
                  placeholder="Pune"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Primary Crop</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sprout className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.primaryCrop}
                  onChange={(e) => setFormData({...formData, primaryCrop: e.target.value})}
                  className="block w-full pl-10 rounded-lg border-gray-300 px-4 py-3 text-gray-900 focus:ring-green-500 focus:border-green-500 sm:text-sm font-medium border"
                  placeholder="Wheat, Rice, Cotton..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Go to Dashboard"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
