"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, ClipboardList, CheckCircle2, Phone, MessageSquare, 
  Clock, Check, Truck, XCircle, ShieldCheck, MapPin, ArrowRightLeft, Sprout, Eye, X, Info, Calendar, Award, Receipt, DollarSign
} from "lucide-react";
import Link from "next/link";
import { ALL_INDIAN_STATES_AND_UTS, FarmerCropListing, BuyerOrderRequest } from "@/app/marketplace/page";

const INITIAL_LISTINGS: FarmerCropListing[] = [
  {
    id: "lst-101",
    cropName: "Organic Wheat (Lokwan)",
    category: "Cereals & Grains",
    iconEmoji: "🌾",
    farmerName: "Rameshwar Patil",
    phone: "+91 98221 45678",
    whatsapp: "919822145678",
    state: "Maharashtra",
    district: "Pune",
    village: "Baramati",
    pricePerQuintal: 2550,
    availableQuantityQuintals: 45,
    qualityGrade: "Organic Certified",
    deliveryOption: "Doorstep Delivery",
    rating: 4.9,
    harvestDate: "2026-07-25",
    description: "100% Organic certified Lokwan wheat grown without chemical pesticides. High protein content, ideal for chapatis and bakery.",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    createdAt: "2 hours ago",
    moistureContent: "11.2% (Optimal Dry)",
    soilType: "Black Loam Soil"
  }
];

const INITIAL_ORDERS: BuyerOrderRequest[] = [
  {
    sequenceNo: 1,
    orderId: "ORD-9081",
    listingId: "lst-101",
    cropName: "Organic Wheat (Lokwan)",
    iconEmoji: "🌾",
    farmerName: "Rameshwar Patil",
    farmerPhone: "+91 98221 45678",
    farmerWhatsapp: "919822145678",
    buyerName: "Amitabh Verma (Hotel Annapurna)",
    buyerPhone: "+91 98200 11223",
    buyerAddress: "Plot 42, Market Yard, Pune, Maharashtra",
    buyerPincode: "411037",
    quantityQuintals: 10,
    pricePerQuintal: 2550,
    subtotal: 25500,
    deliveryFee: 500,
    totalPrice: 26000,
    orderDate: "Today, 02:30 PM",
    status: "Pending",
    paymentMethod: "Cash on Delivery / Direct Bank"
  },
  {
    sequenceNo: 2,
    orderId: "ORD-9082",
    listingId: "lst-101",
    cropName: "Organic Wheat (Lokwan)",
    iconEmoji: "🌾",
    farmerName: "Rameshwar Patil",
    farmerPhone: "+91 98221 45678",
    farmerWhatsapp: "919822145678",
    buyerName: "Rajesh Foods Pvt Ltd",
    buyerPhone: "+91 98450 66778",
    buyerAddress: "APMC Market Gate 3, Bangalore, Karnataka",
    buyerPincode: "560001",
    quantityQuintals: 25,
    pricePerQuintal: 2550,
    subtotal: 63750,
    deliveryFee: 600,
    totalPrice: 64350,
    orderDate: "Yesterday",
    status: "Accepted",
    paymentMethod: "Prepaid Bank"
  },
  {
    sequenceNo: 3,
    orderId: "ORD-9083",
    listingId: "lst-101",
    cropName: "Organic Wheat (Lokwan)",
    iconEmoji: "🌾",
    farmerName: "Rameshwar Patil",
    farmerPhone: "+91 98221 45678",
    farmerWhatsapp: "919822145678",
    buyerName: "Kishore Grain Traders",
    buyerPhone: "+91 94220 33445",
    buyerAddress: "Grain Market Yard, Solapur, Maharashtra",
    buyerPincode: "413001",
    quantityQuintals: 15,
    pricePerQuintal: 2550,
    subtotal: 38250,
    deliveryFee: 450,
    totalPrice: 38700,
    orderDate: "3 days ago",
    status: "Dispatched",
    paymentMethod: "Prepaid Direct"
  }
];

const CATEGORIES = [
  "Cereals & Grains",
  "Vegetables",
  "Fruits",
  "Pulses & Legumes",
  "Oilseeds",
  "Spices & Herbs",
  "Commercial & Plantation"
];

export default function FarmerSellerPortalPage() {
  const [activeTab, setActiveTab] = useState<"post" | "orders" | "my_listings">("post");
  const [listings, setListings] = useState<FarmerCropListing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<BuyerOrderRequest[]>(INITIAL_ORDERS);
  
  // Modals state
  const [inspectingCrop, setInspectingCrop] = useState<FarmerCropListing | null>(null);
  const [inspectingOrder, setInspectingOrder] = useState<BuyerOrderRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // New Farmer Listing Form state
  const [newCropName, setNewCropName] = useState("");
  const [newCategory, setNewCategory] = useState("Cereals & Grains");
  const [newIconEmoji, setNewIconEmoji] = useState("🌾");
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newState, setNewState] = useState("Maharashtra");
  const [newDistrict, setNewDistrict] = useState("");
  const [newVillage, setNewVillage] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newQuality, setNewQuality] = useState<FarmerCropListing["qualityGrade"]>("Grade A Premium");
  const [newDelivery, setNewDelivery] = useState<FarmerCropListing["deliveryOption"]>("Doorstep Delivery");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    const savedListings = localStorage.getItem("agropulse_farmer_listings");
    if (savedListings) {
      try {
        const parsed = JSON.parse(savedListings);
        if (Array.isArray(parsed) && parsed.length > 0) setListings(parsed);
      } catch (e) { console.error(e); }
    }

    const savedOrders = localStorage.getItem("agropulse_farmer_orders");
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
      } catch (e) { console.error(e); }
    }
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter === "All") return true;
      return o.status === statusFilter;
    });
  }, [orders, statusFilter]);

  const orderStats = useMemo(() => {
    const activeOrders = orders.filter(o => !o.status.includes("Cancelled"));
    const totalLifetimeRevenue = activeOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingCount = orders.filter(o => o.status === "Pending").length;
    const acceptedCount = orders.filter(o => o.status === "Accepted").length;
    const dispatchedCount = orders.filter(o => o.status === "Dispatched").length;
    const completedCount = orders.filter(o => o.status === "Completed").length;
    return { totalLifetimeRevenue, pendingCount, acceptedCount, dispatchedCount, completedCount, totalOrders: orders.length };
  }, [orders]);

  const handlePostCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName || !newFarmerName || !newPhone || !newPrice || !newQuantity) {
      alert("Please fill in all required fields.");
      return;
    }

    const cleanPhone = newPhone.replace(/\D/g, "");
    const newListing: FarmerCropListing = {
      id: `lst-${Date.now()}`,
      cropName: newCropName,
      category: newCategory,
      iconEmoji: newIconEmoji,
      farmerName: newFarmerName,
      phone: newPhone.startsWith("+") ? newPhone : `+91 ${newPhone}`,
      whatsapp: cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone,
      state: newState,
      district: newDistrict || "Primary District",
      village: newVillage || "Farm Village",
      pricePerQuintal: Number(newPrice),
      availableQuantityQuintals: Number(newQuantity),
      qualityGrade: newQuality,
      deliveryOption: newDelivery,
      rating: 5.0,
      harvestDate: new Date().toISOString().split("T")[0],
      description: newDescription || "Fresh high-quality crop directly harvested from farm.",
      imageUrl: newImageUrl || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
      createdAt: "Just now",
      moistureContent: "11.5% Standard",
      soilType: "Natural Fertile Soil"
    };

    const updated = [newListing, ...listings];
    setListings(updated);
    localStorage.setItem("agropulse_farmer_listings", JSON.stringify(updated));

    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab("my_listings");
      setNewCropName(""); setNewPrice(""); setNewQuantity(""); setNewDescription(""); setNewImageUrl("");
    }, 2000);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: BuyerOrderRequest["status"]) => {
    let reason: string | undefined = undefined;
    if (newStatus.includes("Cancelled")) {
      reason = prompt("Enter reason for cancelling/rejecting this order request:") || "Cancelled by Farmer";
    }

    const updated = orders.map(o => o.orderId === orderId ? { ...o, status: newStatus, cancellationReason: reason } : o);
    setOrders(updated);
    localStorage.setItem("agropulse_farmer_orders", JSON.stringify(updated));
    
    if (inspectingOrder && inspectingOrder.orderId === orderId) {
      setInspectingOrder(prev => prev ? { ...prev, status: newStatus, cancellationReason: reason } : null);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto">
      
      {/* Farmer Seller Header */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <Sprout className="w-7 h-7 text-green-600 dark:text-green-400" />
            Farmer Seller Portal (List Crops & Manage Orders)
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Put your harvested crop online and manually accept or manage incoming buyer orders.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-white/10 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab("post")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === "post" ? "bg-green-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Post Crop Online
            </button>
            
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 relative ${
                activeTab === "orders" ? "bg-green-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Received Orders
              {orderStats.pendingCount > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {orderStats.pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("my_listings")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === "my_listings" ? "bg-green-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <Sprout className="w-4 h-4" /> My Active Crops ({listings.length})
            </button>
          </div>

          <Link
            href="/marketplace"
            className="hidden lg:flex items-center gap-1.5 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-2.5 rounded-2xl text-xs font-extrabold hover:bg-green-100 transition-colors shadow-sm"
          >
            <span>Switch to Customer Buying Portal</span>
            <ArrowRightLeft className="w-4 h-4 text-green-600" />
          </Link>
        </div>
      </header>

      {/* TAB 1: FARMER POST CROP FORM */}
      {activeTab === "post" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/50 flex items-center justify-center text-green-600 dark:text-green-400">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Put Your Crop Online for Online Buyers</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">List your harvest directly to customers across India with 0% middleman commission.</p>
              </div>
            </div>

            {postSuccess ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Crop Listed Online Successfully!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                  Your crop is now live in the Customer Buying Portal. Incoming buyer order requests will appear in your <strong>Received Orders</strong> tab for your manual approval.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostCrop} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Crop Name & Variety *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Organic Wheat, Red Tomatoes, Basmati Rice"
                      value={newCropName}
                      onChange={(e) => setNewCropName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Farmer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={newFarmerName}
                      onChange={(e) => setNewFarmerName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9822145678"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹ per Quintal) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 2500"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Available Quantity (Quintals) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Select State / UT *</label>
                    <select
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    >
                      {ALL_INDIAN_STATES_AND_UTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">District / Mandi Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nashik, Pune, Ludhiana"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Quality Grade</label>
                    <select
                      value={newQuality}
                      onChange={(e: any) => setNewQuality(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Organic Certified">Organic Certified</option>
                      <option value="Grade A Premium">Grade A Premium</option>
                      <option value="Natural Farming">Natural Farming</option>
                      <option value="Standard Fresh">Standard Fresh</option>
                      <option value="Export Quality">Export Quality</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Delivery Option</label>
                    <select
                      value={newDelivery}
                      onChange={(e: any) => setNewDelivery(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Doorstep Delivery">Doorstep Delivery</option>
                      <option value="Farmer Location Pickup">Farmer Location Pickup</option>
                      <option value="Mandi Transport">Mandi Transport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Photo Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">Crop Description & Details</label>
                  <textarea
                    rows={3}
                    placeholder="Describe crop quality, moisture level, organic farming practices, or delivery options..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-extrabold py-3.5 rounded-xl text-xs hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Publish Crop Online for Buyers
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FARMER RECEIVED ORDERS DESK (WITH LIFETIME REVENUE CARD & DISTINCT ACCEPTED VS DISPATCHED BADGES) */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          
          {/* Lifetime Farmer Revenue & Orders Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-green-600">
              <span className="text-xs font-extrabold text-gray-400 uppercase">Total Lifetime Sales Revenue</span>
              <div className="text-2xl font-black text-green-600 dark:text-green-400 mt-1">₹{orderStats.totalLifetimeRevenue.toLocaleString("en-IN")}</div>
              <span className="text-[10px] text-gray-400 font-semibold">{orderStats.totalOrders} Total Buyer Requests</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-blue-600">
              <span className="text-xs font-extrabold text-gray-400 uppercase">🔵 Accepted Orders</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{orderStats.acceptedCount} Orders</div>
              <span className="text-[10px] text-blue-600 dark:text-blue-300 font-bold">Ready for Dispatch</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-purple-600">
              <span className="text-xs font-extrabold text-gray-400 uppercase">🚚 Dispatched Orders</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{orderStats.dispatchedCount} Orders</div>
              <span className="text-[10px] text-purple-600 dark:text-purple-300 font-bold">En Route Transport</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-amber-500">
              <span className="text-xs font-extrabold text-gray-400 uppercase">⏳ Pending Review</span>
              <div className="text-2xl font-black text-amber-500 mt-1">{orderStats.pendingCount} Orders</div>
              <span className="text-[10px] text-amber-600 dark:text-amber-300 font-bold">Awaiting Your Approval</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden shadow-md">
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 dark:bg-white/5">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-green-600" />
                  Received Buyer Orders (Farmer Desk Review)
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Click any order to view full invoice & buyer details. Sequenced by order number.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1b23] text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <option value="All">All Statuses ({orders.length})</option>
                  <option value="Pending">⏳ Pending Approval</option>
                  <option value="Accepted">🔵 Accepted</option>
                  <option value="Dispatched">🚚 Dispatched</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">No orders found matching status "{statusFilter}"</h4>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredOrders.map((order) => (
                  <div key={order.orderId} className={`p-5 md:p-6 transition-colors ${
                    order.status === "Pending" ? "bg-amber-50/20 dark:bg-amber-950/10" : "hover:bg-gray-50/50 dark:hover:bg-white/5"
                  }`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-2xl bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 font-black text-sm flex items-center justify-center shrink-0 border border-green-200 dark:border-green-800">
                          #{order.sequenceNo}
                        </span>

                        <span className="text-3xl p-2 bg-green-50 dark:bg-green-950/40 rounded-xl border border-green-200 dark:border-green-800">
                          {order.iconEmoji}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gray-400 uppercase">{order.orderId}</span>
                            <span className="text-xs text-gray-400 font-semibold">• {order.orderDate}</span>
                          </div>
                          <h4 className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">
                            {order.cropName}
                          </h4>
                          <p className="text-xs font-bold text-green-700 dark:text-green-400">
                            Farmer: {order.farmerName}
                          </p>
                        </div>
                      </div>

                      {/* DISTINCT STATUS BADGES FOR ACCEPTED vs DISPATCHED */}
                      <div>
                        <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm ${
                          order.status === "Pending" ? "bg-amber-500 text-white animate-pulse" :
                          order.status === "Accepted" ? "bg-blue-600 text-white" :
                          order.status === "Dispatched" ? "bg-purple-600 text-white" :
                          order.status === "Completed" ? "bg-green-600 text-white" :
                          "bg-red-600 text-white"
                        }`}>
                          {order.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
                          {order.status === "Accepted" && <Check className="w-3.5 h-3.5" />}
                          {order.status === "Dispatched" && <Truck className="w-3.5 h-3.5" />}
                          {order.status === "Completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {order.status.includes("Cancelled") && <XCircle className="w-3.5 h-3.5" />}
                          
                          {order.status === "Pending" ? "⏳ Pending Farmer Approval" :
                           order.status === "Accepted" ? "🔵 Accepted Order" :
                           order.status === "Dispatched" ? "🚚 Dispatched Transport" :
                           order.status === "Completed" ? "✅ Completed & Delivered" :
                           `Status: ${order.status}`}
                        </span>
                      </div>

                    </div>

                    <div 
                      onClick={() => setInspectingOrder(order)}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 mb-4 text-xs cursor-pointer hover:border-green-400 transition-colors"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Buyer Info</span>
                        <div className="font-extrabold text-gray-900 dark:text-white mt-1">{order.buyerName}</div>
                        <div className="text-gray-500 font-semibold mt-0.5">{order.buyerPhone}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Delivery Address & Pincode</span>
                        <div className="font-semibold text-gray-700 dark:text-gray-300 mt-1">{order.buyerAddress}</div>
                        {order.buyerPincode && <div className="text-green-600 font-bold">Pincode: {order.buyerPincode}</div>}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Quantity Bought</span>
                        <div className="font-extrabold text-gray-900 dark:text-white mt-1">{order.quantityQuintals} Quintals</div>
                        <div className="text-gray-400 font-semibold">@ ₹{order.pricePerQuintal.toLocaleString("en-IN")}/q</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Order Revenue</span>
                        <div className="font-extrabold text-green-700 dark:text-green-400 text-sm mt-1">
                          ₹{order.totalPrice.toLocaleString("en-IN")}
                        </div>
                        <div className="text-xs text-green-600 font-bold flex items-center gap-1 mt-0.5">
                          <Eye className="w-3 h-3" /> Click to Inspect Order
                        </div>
                      </div>
                    </div>

                    {/* MANUAL FARMER ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInspectingOrder(order)}
                          className="bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5 text-green-600" /> Full Order Invoice
                        </button>

                        {order.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderId, "Accepted")}
                              className="bg-green-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-green-700 transition-all shadow-md flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4" /> Accept Order
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderId, "Cancelled by Farmer")}
                              className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold px-3 py-2 rounded-xl text-xs hover:bg-red-100 transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Cancel / Reject
                            </button>
                          </>
                        )}

                        {order.status === "Accepted" && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderId, "Dispatched")}
                              className="bg-purple-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-purple-700 transition-all shadow-md flex items-center gap-1.5"
                            >
                              <Truck className="w-4 h-4" /> Dispatch Crop Transport
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderId, "Cancelled by Farmer")}
                              className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold px-3 py-2 rounded-xl text-xs hover:bg-red-100 transition-colors"
                            >
                              Cancel Order
                            </button>
                          </>
                        )}

                        {order.status === "Dispatched" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.orderId, "Completed")}
                            className="bg-emerald-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-emerald-700 transition-all shadow-md flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Mark Order Completed
                          </button>
                        )}

                        {order.status === "Completed" && (
                          <span className="text-xs font-extrabold text-green-600 dark:text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Order Successfully Fulfilled
                          </span>
                        )}

                        {order.status.includes("Cancelled") && (
                          <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Order Cancelled ({order.status})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${order.buyerPhone.replace(/\D/g, "")}?text=Hi%20${order.buyerName},%20regarding%20your%20order%20%23${order.sequenceNo}%20(${order.orderId})%20for%20${order.cropName}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-emerald-100"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Buyer
                        </a>
                        <a
                          href={`tel:${order.buyerPhone}`}
                          className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-gray-200"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Buyer
                        </a>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FARMER'S MY ACTIVE LISTINGS */}
      {activeTab === "my_listings" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">My Active Crop Listings</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Crops you have published for online buyers. Click any crop card to inspect full details.</p>
            </div>
            <button
              onClick={() => setActiveTab("post")}
              className="bg-green-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Add New Crop
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setInspectingCrop(item)}
                className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all p-5 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-base group-hover:text-green-600 transition-colors">{item.cropName}</h4>
                  <span className="text-2xl">{item.iconEmoji}</span>
                </div>
                <div className="text-xs text-gray-400 font-semibold mb-3">{item.village}, {item.district}, {item.state}</div>
                <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-xl flex justify-between items-center text-xs mb-3">
                  <span className="font-bold text-green-800 dark:text-green-300">Rate: ₹{item.pricePerQuintal}/q</span>
                  <span className="font-extrabold text-gray-700 dark:text-gray-300">Stock: {item.availableQuantityQuintals} quintals</span>
                </div>
                <button className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-extrabold py-2 rounded-xl flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-green-600" /> View Full Listing Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED ORDER INSPECTION MODAL FOR FARMER DESK */}
      <AnimatePresence>
        {inspectingOrder && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-xl w-full my-8 p-6 md:p-8 relative overflow-hidden shadow-2xl space-y-5"
            >
              <button 
                onClick={() => setInspectingOrder(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-white p-2 rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/10">
                <span className="w-10 h-10 rounded-2xl bg-green-600 text-white font-black text-base flex items-center justify-center shrink-0">
                  #{inspectingOrder.sequenceNo}
                </span>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg flex items-center gap-2">
                    {inspectingOrder.cropName} {inspectingOrder.iconEmoji}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold">Order ID: {inspectingOrder.orderId} • Date: {inspectingOrder.orderDate}</p>
                </div>
              </div>

              {/* Status Timeline Progress */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Order Status Timeline</span>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={`px-2.5 py-1 rounded-lg ${inspectingOrder.status === "Pending" ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-600"}`}>⏳ Pending</span>
                  <span className="text-gray-300">→</span>
                  <span className={`px-2.5 py-1 rounded-lg ${inspectingOrder.status === "Accepted" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>🔵 Accepted</span>
                  <span className="text-gray-300">→</span>
                  <span className={`px-2.5 py-1 rounded-lg ${inspectingOrder.status === "Dispatched" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}>🚚 Dispatched</span>
                  <span className="text-gray-300">→</span>
                  <span className={`px-2.5 py-1 rounded-lg ${inspectingOrder.status === "Completed" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}>✅ Delivered</span>
                </div>
              </div>

              {/* Itemized Order Breakdown */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-2 text-xs">
                <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
                  <span className="text-gray-500 font-bold">Buyer Name:</span>
                  <span className="font-extrabold text-gray-900 dark:text-white">{inspectingOrder.buyerName}</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
                  <span className="text-gray-500 font-bold">Buyer Phone:</span>
                  <span className="font-extrabold text-gray-900 dark:text-white">{inspectingOrder.buyerPhone}</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
                  <span className="text-gray-500 font-bold">Delivery Address:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-right max-w-[220px]">{inspectingOrder.buyerAddress} - <strong className="text-green-600">{inspectingOrder.buyerPincode}</strong></span>
                </div>

                <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
                  <span className="text-gray-500 font-bold">Seller Farmer:</span>
                  <span className="font-extrabold text-green-700 dark:text-green-400">{inspectingOrder.farmerName} ({inspectingOrder.farmerPhone})</span>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-gray-500 font-bold">Quantity Ordered:</span>
                  <span className="font-extrabold text-gray-900 dark:text-white">{inspectingOrder.quantityQuintals} Quintals @ ₹{inspectingOrder.pricePerQuintal.toLocaleString("en-IN")}/q</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Subtotal:</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{inspectingOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Freight Fee:</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{inspectingOrder.deliveryFee}</span>
                </div>

                <div className="flex justify-between border-t border-gray-200 dark:border-white/10 pt-3 text-sm font-black">
                  <span className="text-gray-900 dark:text-white">Total Revenue Amount:</span>
                  <span className="text-green-600 dark:text-green-400 text-base">₹{inspectingOrder.totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* FARMER ACTIONS INSIDE ORDER INSPECTION MODAL */}
              <div className="grid grid-cols-2 gap-3">
                {inspectingOrder.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleUpdateOrderStatus(inspectingOrder.orderId, "Accepted")}
                      className="bg-green-600 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Accept Order
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(inspectingOrder.orderId, "Cancelled by Farmer")}
                      className="bg-red-50 text-red-600 font-extrabold py-3 rounded-xl text-xs"
                    >
                      Reject Order
                    </button>
                  </>
                )}

                {inspectingOrder.status === "Accepted" && (
                  <button
                    onClick={() => handleUpdateOrderStatus(inspectingOrder.orderId, "Dispatched")}
                    className="col-span-2 bg-purple-600 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" /> Dispatch Crop Transport
                  </button>
                )}

                {inspectingOrder.status === "Dispatched" && (
                  <button
                    onClick={() => handleUpdateOrderStatus(inspectingOrder.orderId, "Completed")}
                    className="col-span-2 bg-emerald-600 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Order Completed & Delivered
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL CROP INSPECTION MODAL FOR FARMER DESK LISTINGS */}
      <AnimatePresence>
        {inspectingCrop && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setInspectingCrop(null)}
                className="absolute top-4 right-4 z-20 text-white bg-black/60 hover:bg-black/90 p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 w-full bg-gray-100 dark:bg-white/5">
                <img 
                  src={inspectingCrop.imageUrl} 
                  alt={inspectingCrop.cropName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                  <div>
                    <span className="bg-green-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-md mb-2 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {inspectingCrop.qualityGrade}
                    </span>
                    <h2 className="text-2xl font-black text-white leading-tight flex items-center gap-2">
                      {inspectingCrop.cropName} <span className="text-3xl">{inspectingCrop.iconEmoji}</span>
                    </h2>
                    <p className="text-xs text-green-300 font-bold mt-0.5">
                      Farmer: {inspectingCrop.farmerName} • {inspectingCrop.village}, {inspectingCrop.district}, {inspectingCrop.state}
                    </p>
                  </div>

                  <div className="text-right bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <span className="text-[10px] text-gray-300 uppercase block font-bold">Farmer Rate</span>
                    <div className="text-xl font-black text-green-400">
                      ₹{inspectingCrop.pricePerQuintal.toLocaleString("en-IN")}
                      <span className="text-xs font-semibold text-gray-300">/quintal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-green-600" /> Crop Description & Quality Summary
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    {inspectingCrop.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                      <Sprout className="w-3 h-3 text-green-500" /> Category
                    </span>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white mt-1">{inspectingCrop.category}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-500" /> Harvest Date
                    </span>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white mt-1">{inspectingCrop.harvestDate}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-500" /> Moisture Level
                    </span>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white mt-1">{inspectingCrop.moistureContent || "11-12% Optimal"}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-purple-500" /> Logistics
                    </span>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white mt-1">{inspectingCrop.deliveryOption}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
