"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, MapPin, Phone, MessageSquare, 
  CheckCircle2, X, ShieldCheck, ArrowRight, Truck, Star, ArrowUpDown, User, XCircle, Clock, ArrowRightCircle, Sparkles, Check, FileText, ChevronRight, Hash, Receipt, Eye, Calendar, Sprout, Award, Info, DollarSign, ListOrdered, ChevronDown, AlertTriangle
} from "lucide-react";
import Link from "next/link";

export interface FarmerCropListing {
  id: string;
  cropName: string;
  category: string;
  iconEmoji: string;
  farmerName: string;
  phone: string;
  whatsapp: string;
  state: string;
  district: string;
  village: string;
  pricePerQuintal: number;
  availableQuantityQuintals: number;
  qualityGrade: "Organic Certified" | "Grade A Premium" | "Standard Fresh" | "Export Quality" | "Natural Farming";
  deliveryOption: "Doorstep Delivery" | "Farmer Location Pickup" | "Mandi Transport";
  rating: number;
  harvestDate: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  moistureContent?: string;
  soilType?: string;
}

export interface BuyerOrderRequest {
  sequenceNo: number;
  orderId: string;
  listingId: string;
  cropName: string;
  iconEmoji: string;
  farmerName: string;
  farmerPhone: string;
  farmerWhatsapp: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerPincode: string;
  quantityQuintals: number;
  pricePerQuintal: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  orderDate: string;
  status: "Pending" | "Accepted" | "Dispatched" | "Completed" | "Cancelled by Buyer" | "Cancelled by Farmer";
  cancellationReason?: string;
  paymentMethod: string;
}

export const ALL_INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi NCR", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// COMPREHENSIVE MANDI CROPS LISTING DATABASE
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
    description: "100% Organic certified Lokwan wheat grown without chemical pesticides. High gluten and protein content, ideal for soft chapatis, rotis, and commercial baking.",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    createdAt: "2 hours ago",
    moistureContent: "11.2% (Optimal Dry)",
    soilType: "Black Loam Soil"
  },
  {
    id: "lst-102",
    cropName: "Fresh Red Tomatoes (Hybrid)",
    category: "Vegetables",
    iconEmoji: "🍅",
    farmerName: "Venkatesh Gowda",
    phone: "+91 94480 12345",
    whatsapp: "919448012345",
    state: "Karnataka",
    district: "Kolar",
    village: "Mulbagal",
    pricePerQuintal: 1650,
    availableQuantityQuintals: 120,
    qualityGrade: "Grade A Premium",
    deliveryOption: "Farmer Location Pickup",
    rating: 4.8,
    harvestDate: "2026-07-29",
    description: "Freshly harvested firm red tomatoes with high shelf life (up to 14 days). Ideal for hotels, wholesale markets, sauce manufacturing, and retail grocery stores.",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    createdAt: "5 hours ago",
    moistureContent: "Fresh Juicy Harvest",
    soilType: "Red Clay Loam"
  },
  {
    id: "lst-103",
    cropName: "Premium Basmati Rice (1121)",
    category: "Cereals & Grains",
    iconEmoji: "🌾",
    farmerName: "Gurpreet Singh",
    phone: "+91 98140 98765",
    whatsapp: "919814098765",
    state: "Punjab",
    district: "Ludhiana",
    village: "Jagraon",
    pricePerQuintal: 4350,
    availableQuantityQuintals: 200,
    qualityGrade: "Export Quality",
    deliveryOption: "Mandi Transport",
    rating: 5.0,
    harvestDate: "2026-07-20",
    description: "Aged 1121 extra-long grain Basmati rice direct from Punjab farm. Double polished, 0% broken grains, distinct aromatic fragrance.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    createdAt: "1 day ago",
    moistureContent: "12.0% Standard",
    soilType: "Alluvial Canal Soil"
  },
  {
    id: "lst-104",
    cropName: "Onion (Nashik Red)",
    category: "Vegetables",
    iconEmoji: "🧅",
    farmerName: "Dnyaneshwar Shinde",
    phone: "+91 98230 77889",
    whatsapp: "919823077889",
    state: "Maharashtra",
    district: "Nashik",
    village: "Lasalgaon",
    pricePerQuintal: 1850,
    availableQuantityQuintals: 150,
    qualityGrade: "Export Quality",
    deliveryOption: "Doorstep Delivery",
    rating: 4.9,
    harvestDate: "2026-07-28",
    description: "Authentic Lasalgaon Nashik Red onions. Well cured, dry skin, high pungency, long storage life.",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
    createdAt: "3 hours ago"
  },
  {
    id: "lst-105",
    cropName: "Alphonso Mango (Ratnagiri Hapus)",
    category: "Fruits",
    iconEmoji: "🥭",
    farmerName: "Subhash Kelkar",
    phone: "+91 94220 33445",
    whatsapp: "919422033445",
    state: "Maharashtra",
    district: "Ratnagiri",
    village: "Devgad",
    pricePerQuintal: 18500,
    availableQuantityQuintals: 30,
    qualityGrade: "Organic Certified",
    deliveryOption: "Doorstep Delivery",
    rating: 5.0,
    harvestDate: "2026-07-27",
    description: "GI-Tagged original Ratnagiri Alphonso mangoes. Naturally ripened in straw, rich saffron pulp, world famous fragrance.",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
    createdAt: "1 hour ago"
  },
  {
    id: "lst-106",
    cropName: "Kashmiri Red Apple",
    category: "Fruits",
    iconEmoji: "🍎",
    farmerName: "Tariq Ahmad Mir",
    phone: "+91 99060 11223",
    whatsapp: "919906011223",
    state: "Jammu and Kashmir",
    district: "Baramulla",
    village: "Sopore",
    pricePerQuintal: 12500,
    availableQuantityQuintals: 85,
    qualityGrade: "Export Quality",
    deliveryOption: "Mandi Transport",
    rating: 4.9,
    harvestDate: "2026-07-26",
    description: "Crisp, sweet, deep red Sopore Kashmiri Delicious Apples direct from orchard. Hand-picked and wooden crate packed.",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    createdAt: "4 hours ago"
  },
  {
    id: "lst-107",
    cropName: "Pigeon Pea / Tur (Arhar Red)",
    category: "Pulses & Legumes",
    iconEmoji: "🫘",
    farmerName: "Hanumant Rao",
    phone: "+91 94231 66778",
    whatsapp: "919423166778",
    state: "Maharashtra",
    district: "Latur",
    village: "Ausa",
    pricePerQuintal: 10200,
    availableQuantityQuintals: 60,
    qualityGrade: "Grade A Premium",
    deliveryOption: "Farmer Location Pickup",
    rating: 4.7,
    harvestDate: "2026-07-22",
    description: "Latur special bold Red Tur / Arhar dal whole grain. Unpolished, chemical-free processing.",
    imageUrl: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80",
    createdAt: "6 hours ago"
  },
  {
    id: "lst-108",
    cropName: "Chickpea / Chana (Desi)",
    category: "Pulses & Legumes",
    iconEmoji: "🫘",
    farmerName: "Vikramaditya Singh",
    phone: "+91 98260 55443",
    whatsapp: "919826055443",
    state: "Madhya Pradesh",
    district: "Ujjain",
    village: "Nagda",
    pricePerQuintal: 6250,
    availableQuantityQuintals: 90,
    qualityGrade: "Standard Fresh",
    deliveryOption: "Doorstep Delivery",
    rating: 4.8,
    harvestDate: "2026-07-24",
    description: "Ujjain Mandi bold Desi Chana. High germination rate, ideal for dal milling and sprouts.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    createdAt: "Just now"
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
    buyerName: "Amitabh Verma",
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
    listingId: "lst-105",
    cropName: "Alphonso Mango (Ratnagiri Hapus)",
    iconEmoji: "🥭",
    farmerName: "Subhash Kelkar",
    farmerPhone: "+91 94220 33445",
    farmerWhatsapp: "919422033445",
    buyerName: "Amitabh Verma",
    buyerPhone: "+91 98200 11223",
    buyerAddress: "Plot 42, Market Yard, Pune, Maharashtra",
    buyerPincode: "411037",
    quantityQuintals: 5,
    pricePerQuintal: 18500,
    subtotal: 92500,
    deliveryFee: 400,
    totalPrice: 92900,
    orderDate: "Yesterday",
    status: "Cancelled by Farmer",
    cancellationReason: "Stock depleted due to heavy unseasonal rains at farm orchard in Ratnagiri.",
    paymentMethod: "Prepaid Bank Transfer"
  },
  {
    sequenceNo: 3,
    orderId: "ORD-9083",
    listingId: "lst-104",
    cropName: "Onion (Nashik Red)",
    iconEmoji: "🧅",
    farmerName: "Dnyaneshwar Shinde",
    farmerPhone: "+91 98230 77889",
    farmerWhatsapp: "919823077889",
    buyerName: "Amitabh Verma",
    buyerPhone: "+91 98200 11223",
    buyerAddress: "Plot 42, Market Yard, Pune, Maharashtra",
    buyerPincode: "411037",
    quantityQuintals: 20,
    pricePerQuintal: 1850,
    subtotal: 37000,
    deliveryFee: 500,
    totalPrice: 37500,
    orderDate: "2 days ago",
    status: "Accepted",
    paymentMethod: "Prepaid Direct"
  }
];

const CATEGORIES = [
  "All Categories",
  "Cereals & Grains",
  "Vegetables",
  "Fruits",
  "Pulses & Legumes",
  "Oilseeds",
  "Spices & Herbs",
  "Commercial & Plantation"
];

export default function CustomerMarketplacePage() {
  const [activeTab, setActiveTab] = useState<"browse" | "my_orders">("browse");
  const [listings, setListings] = useState<FarmerCropListing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<BuyerOrderRequest[]>(INITIAL_ORDERS);
  const [groupBy, setGroupBy] = useState<"crop" | "location">("crop");
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedState, setSelectedState] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "quantity">("newest");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Detailed Modals State
  const [inspectingCrop, setInspectingCrop] = useState<FarmerCropListing | null>(null);
  const [inspectingOrder, setInspectingOrder] = useState<BuyerOrderRequest | null>(null);

  // Multi-step Checkout Modal State
  const [buyingListing, setBuyingListing] = useState<FarmerCropListing | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState<string>("1");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerStreet, setBuyerStreet] = useState("");
  const [buyerCity, setBuyerCity] = useState("");
  const [buyerPincode, setBuyerPincode] = useState("");

  useEffect(() => {
    let currentListings = INITIAL_LISTINGS;
    const savedListings = localStorage.getItem("agropulse_farmer_listings");
    if (savedListings) {
      try {
        const parsed = JSON.parse(savedListings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(p => p.id));
          const merged = [...parsed];
          INITIAL_LISTINGS.forEach(item => {
            if (!existingIds.has(item.id)) merged.push(item);
          });
          currentListings = merged;
        }
      } catch (e) { console.error(e); }
    }

    // Read URL search, city, state, and mandi parameters if passed from Mandi Finder
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search");
      const city = params.get("city");
      const state = params.get("state");
      const mandi = params.get("mandi");

      if (query) {
        setSearchQuery(query);
      }
      if (state && state !== "All" && state !== "undefined") {
        setSelectedState(state);
      }

      if (query && (city || state)) {
        const targetCity = city || "Local Mandi";
        const targetState = state || "Madhya Pradesh";
        const targetMandi = mandi || "APMC Mandi";

        const cityMatch = currentListings.find(item => 
          item.cropName.toLowerCase().includes(query.toLowerCase()) &&
          (item.state.toLowerCase().includes(targetState.toLowerCase()) || item.district.toLowerCase().includes(targetCity.toLowerCase()))
        );

        if (!cityMatch) {
          const localFarmerNames = ["Suresh Patel", "Rajeshwar Yadav", "Mohanlal Sharma", "Dinesh Verma", "Shivpal Singh"];
          const randomFarmer = localFarmerNames[Math.floor(Math.random() * localFarmerNames.length)];

          const localListing: FarmerCropListing = {
            id: `lst-local-${Date.now()}`,
            cropName: `${query} (${targetCity} Fresh Harvest)`,
            category: "Direct Mandi Harvest",
            iconEmoji: query.toLowerCase().includes("wheat") ? "🌾" : query.toLowerCase().includes("rice") ? "🌾" : query.toLowerCase().includes("tomato") ? "🍅" : query.toLowerCase().includes("onion") ? "🧅" : query.toLowerCase().includes("mango") ? "🥭" : query.toLowerCase().includes("apple") ? "🍎" : "🌿",
            farmerName: `${randomFarmer} (${targetCity} Farmer)`,
            phone: "+91 98765 43210",
            whatsapp: "919876543210",
            state: targetState,
            district: targetCity,
            village: `${targetMandi} Hub`,
            pricePerQuintal: query.toLowerCase().includes("mango") ? 18500 : query.toLowerCase().includes("apple") ? 12500 : query.toLowerCase().includes("rice") ? 4350 : query.toLowerCase().includes("tur") ? 10200 : query.toLowerCase().includes("chana") ? 6250 : 2550,
            availableQuantityQuintals: 85,
            qualityGrade: "Grade A Premium",
            deliveryOption: "Doorstep Delivery",
            rating: 4.9,
            harvestDate: "2026-07-30",
            description: `Freshly harvested ${query} directly from ${targetMandi}, ${targetCity}, ${targetState}. High quality grade, zero middleman markup. Ready for fast delivery.`,
            imageUrl: query.toLowerCase().includes("tomato") ? "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80" : query.toLowerCase().includes("onion") ? "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80" : query.toLowerCase().includes("mango") ? "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80" : query.toLowerCase().includes("apple") ? "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80" : "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
            createdAt: "Live Just Now"
          };

          currentListings = [localListing, ...currentListings];
        }
      }
    }

    setListings(currentListings);

    const savedOrders = localStorage.getItem("agropulse_farmer_orders");
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(p => p.orderId));
          const merged = [...parsed];
          INITIAL_ORDERS.forEach(o => {
            if (!existingIds.has(o.orderId)) merged.push(o);
          });
          setOrders(merged);
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  // Filter listings
  const filteredListings = useMemo(() => {
    let result = listings.filter((item) => {
      const matchSearch = !searchQuery.trim() || 
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
      const matchState = selectedState === "All" || item.state === selectedState;
      const matchGrade = selectedGrade === "All" || item.qualityGrade === selectedGrade;

      return matchSearch && matchCategory && matchState && matchGrade;
    });

    if (sortBy === "price_asc") result.sort((a, b) => a.pricePerQuintal - b.pricePerQuintal);
    else if (sortBy === "price_desc") result.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
    else if (sortBy === "quantity") result.sort((a, b) => b.availableQuantityQuintals - a.availableQuantityQuintals);

    return result;
  }, [listings, searchQuery, selectedCategory, selectedState, selectedGrade, sortBy]);

  // Filter Orders with explicit "Cancelled by Farmer" support
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter === "All") return true;
      return o.status === statusFilter;
    });
  }, [orders, statusFilter]);

  // Lifetime Customer Transaction Stats
  const buyerTransactionStats = useMemo(() => {
    const activeOrders = orders.filter(o => !o.status.includes("Cancelled"));
    const totalLifetimeSpend = activeOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingCount = orders.filter(o => o.status === "Pending").length;
    const acceptedCount = orders.filter(o => o.status === "Accepted").length;
    const dispatchedCount = orders.filter(o => o.status === "Dispatched").length;
    const completedCount = orders.filter(o => o.status === "Completed").length;
    const cancelledByFarmerCount = orders.filter(o => o.status === "Cancelled by Farmer").length;
    const cancelledByBuyerCount = orders.filter(o => o.status === "Cancelled by Buyer").length;

    return { 
      totalLifetimeSpend, 
      pendingCount, 
      acceptedCount, 
      dispatchedCount, 
      completedCount, 
      cancelledByFarmerCount,
      cancelledByBuyerCount,
      totalOrders: orders.length 
    };
  }, [orders]);

  const groupedData = useMemo(() => {
    const map: Record<string, FarmerCropListing[]> = {};
    filteredListings.forEach((item) => {
      const key = groupBy === "crop" ? item.category : `${item.state}`;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [filteredListings, groupBy]);

  const checkoutCalculations = useMemo(() => {
    if (!buyingListing) return { subtotal: 0, deliveryFee: 0, grandTotal: 0 };
    const subtotal = orderQuantity * buyingListing.pricePerQuintal;
    const deliveryFee = buyingListing.deliveryOption === "Doorstep Delivery" ? 400 : 0;
    const grandTotal = subtotal + deliveryFee;
    return { subtotal, deliveryFee, grandTotal };
  }, [buyingListing, orderQuantity]);

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !buyerStreet || !buyerCity || !buyerPincode) {
      alert("Please fill in all delivery details including your pincode.");
      return;
    }
    setCheckoutStep(2);
  };

  const handleFinalOrderSubmit = () => {
    if (!buyingListing) return;

    const fullAddress = `${buyerStreet}, ${buyerCity}, ${buyingListing.state}`;
    const nextSeq = orders.length > 0 ? Math.max(...orders.map(o => o.sequenceNo || 0)) + 1 : 1;
    
    const newOrder: BuyerOrderRequest = {
      sequenceNo: nextSeq,
      orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      listingId: buyingListing.id,
      cropName: buyingListing.cropName,
      iconEmoji: buyingListing.iconEmoji,
      farmerName: buyingListing.farmerName,
      farmerPhone: buyingListing.phone,
      farmerWhatsapp: buyingListing.whatsapp,
      buyerName: buyerName,
      buyerPhone: buyerPhone,
      buyerAddress: fullAddress,
      buyerPincode: buyerPincode,
      quantityQuintals: orderQuantity,
      pricePerQuintal: buyingListing.pricePerQuintal,
      subtotal: checkoutCalculations.subtotal,
      deliveryFee: checkoutCalculations.deliveryFee,
      totalPrice: checkoutCalculations.grandTotal,
      orderDate: "Just now",
      status: "Pending",
      paymentMethod: "Cash on Delivery / Direct Bank Transfer"
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("agropulse_farmer_orders", JSON.stringify(updatedOrders));

    setCheckoutStep(3);
  };

  const startCheckout = (listing: FarmerCropListing) => {
    setInspectingCrop(null);
    setBuyingListing(listing);
    setOrderQuantity(1);
    setQuantityInput("1");
    setCheckoutStep(1);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto">
      
      {/* Customer Header Bar */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-green-200 dark:border-green-800">
              🛒 Customer Portal
            </span>
            <span className="text-xs text-gray-400 font-semibold">• Sequential Orders & Lifetime Spending</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <ShoppingBag className="w-8 h-8 text-green-600 dark:text-green-400 shrink-0" />
            Buy Crops Directly From Farmers & Mandis
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-white/10 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === "browse" ? "bg-green-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Browse Crops ({filteredListings.length})
            </button>
            <button
              onClick={() => setActiveTab("my_orders")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeTab === "my_orders" ? "bg-green-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <User className="w-4 h-4" /> My Orders ({orders.length})
            </button>
          </div>

          <Link
            href="/seller"
            className="hidden lg:flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-4 py-2.5 rounded-2xl text-xs font-extrabold hover:bg-amber-100 transition-colors shadow-sm"
          >
            <span>Switch to Farmer Seller Desk</span>
            <ArrowRightCircle className="w-4 h-4 text-amber-600" />
          </Link>
        </div>
      </header>

      {/* BROWSE CROPS TO BUY */}
      {activeTab === "browse" && (
        <div>
          {/* Controls Bar */}
          <div className="bg-white dark:bg-[#1a1b23] p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 text-sm font-semibold bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-green-500"
                  placeholder="Search by crop, farmer name, district, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Complete 36 States & UTs Dropdown */}
              <div className="relative w-full md:w-56">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  <option value="All">All 36 States & UTs</option>
                  {ALL_INDIAN_STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative w-full md:w-44">
                <ArrowUpDown className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="quantity">Max Stock Quantity</option>
                </select>
              </div>

              {/* Group By Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl shrink-0 w-full md:w-auto">
                <button
                  onClick={() => setGroupBy("crop")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    groupBy === "crop" ? "bg-white dark:bg-[#1a1b23] text-green-700 dark:text-green-400 shadow-sm" : "text-gray-500"
                  }`}
                >
                  By Crop Type
                </button>
                <button
                  onClick={() => setGroupBy("location")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    groupBy === "location" ? "bg-white dark:bg-[#1a1b23] text-green-700 dark:text-green-400 shadow-sm" : "text-gray-500"
                  }`}
                >
                  By Location
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                    selectedCategory === cat
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-green-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* LISTINGS DISPLAY GROUPED */}
          {filteredListings.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl p-12 text-center my-8">
              <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No crop listings match "{searchQuery}"</h3>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedState("All"); setSelectedCategory("All Categories"); setSelectedGrade("All"); }}
                className="mt-4 bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            Object.entries(groupedData).map(([groupTitle, items]) => (
              <div key={groupTitle} className="mb-10">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-white/10 pb-2">
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    {groupBy === "crop" ? "📦" : "📍"} {groupTitle}
                    <span className="text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2.5 py-0.5 rounded-full ml-1">
                      {items.length} Mandi Listings Available
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((listing) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Header with Click to Inspect Overlay */}
                        <div 
                          onClick={() => setInspectingCrop(listing)}
                          className="relative h-52 w-full bg-gray-100 dark:bg-white/5 overflow-hidden cursor-pointer"
                        >
                          <img 
                            src={listing.imageUrl} 
                            alt={listing.cropName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> {listing.qualityGrade}
                          </span>

                          <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-green-400" /> {listing.deliveryOption}
                          </span>

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/90 text-gray-900 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
                              <Eye className="w-4 h-4 text-green-600" /> View Crop Details
                            </span>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-5" onClick={() => setInspectingCrop(listing)}>
                          <div className="flex justify-between items-start mb-2 cursor-pointer">
                            <div>
                              <h3 className="font-extrabold text-gray-900 dark:text-white text-base leading-snug group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                {listing.cropName}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs font-bold text-green-700 dark:text-green-400">
                                  Seller: {listing.farmerName}
                                </span>
                                <span className="flex items-center text-[11px] text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-950/30 px-1.5 py-0.5 rounded-md">
                                  <Star className="w-3 h-3 fill-yellow-400 mr-0.5" /> {listing.rating}
                                </span>
                              </div>
                            </div>
                            <span className="text-2xl">{listing.iconEmoji}</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{listing.village}, {listing.district}, {listing.state}</span>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                            {listing.description}
                          </p>

                          {/* Price Banner */}
                          <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 p-3.5 rounded-xl flex justify-between items-center mb-4">
                            <div>
                              <span className="text-[10px] font-extrabold text-green-700 dark:text-green-400 uppercase">Mandi Rate</span>
                              <div className="text-lg font-extrabold text-green-700 dark:text-green-400">₹{listing.pricePerQuintal.toLocaleString("en-IN")}<span className="text-xs font-bold text-gray-500">/quintal</span></div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-gray-400 block font-semibold">Available Stock</span>
                              <span className="text-xs font-extrabold text-gray-900 dark:text-white">{listing.availableQuantityQuintals} Quintals</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setInspectingCrop(listing)}
                          className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-extrabold py-2.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-green-600" /> View Details
                        </button>

                        <button
                          onClick={() => startCheckout(listing)}
                          className="bg-green-600 text-white font-extrabold py-2.5 rounded-xl text-xs hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ShoppingBag className="w-4 h-4" /> Buy Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MY CUSTOMER ORDERS (WITH EXPLICIT "CANCELLED BY FARMER" FILTER & BADGES) */}
      {activeTab === "my_orders" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-green-600">
              <span className="text-xs font-extrabold text-gray-400 uppercase">Lifetime Spend</span>
              <div className="text-xl font-black text-green-600 dark:text-green-400 mt-1">₹{buyerTransactionStats.totalLifetimeSpend.toLocaleString("en-IN")}</div>
              <span className="text-[10px] text-gray-400 font-semibold">{buyerTransactionStats.totalOrders} Orders</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-blue-600">
              <span className="text-xs font-extrabold text-gray-400 uppercase">🔵 Accepted</span>
              <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">{buyerTransactionStats.acceptedCount} Orders</div>
              <span className="text-[10px] text-blue-600 font-bold">Approved</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-purple-600">
              <span className="text-xs font-extrabold text-gray-400 uppercase">🚚 Dispatched</span>
              <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">{buyerTransactionStats.dispatchedCount} Orders</div>
              <span className="text-[10px] text-purple-600 font-bold">En Route</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-amber-500">
              <span className="text-xs font-extrabold text-gray-400 uppercase">⏳ Pending</span>
              <div className="text-xl font-black text-amber-500 mt-1">{buyerTransactionStats.pendingCount} Orders</div>
              <span className="text-[10px] text-amber-600 font-bold">Awaiting</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-red-600">
              <span className="text-xs font-extrabold text-gray-400 uppercase">❌ Cancelled by Farmer</span>
              <div className="text-xl font-black text-red-600 dark:text-red-400 mt-1">{buyerTransactionStats.cancelledByFarmerCount} Orders</div>
              <span className="text-[10px] text-red-600 font-bold">Rejected by Farmer</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden shadow-md">
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 dark:bg-white/5">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  My Customer Purchase Orders
                </h3>
                <p className="text-xs text-gray-400 font-medium">Filter by status to view pending, accepted, dispatched, or farmer-cancelled crop orders.</p>
              </div>

              {/* ENHANCED STATUS FILTER DROPDOWN WITH EXPLICIT "CANCELLED BY FARMER" OPTION */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1b23] text-xs font-black text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="All">All Statuses ({orders.length})</option>
                  <option value="Pending">⏳ Pending Approval ({buyerTransactionStats.pendingCount})</option>
                  <option value="Accepted">🔵 Accepted by Farmer ({buyerTransactionStats.acceptedCount})</option>
                  <option value="Dispatched">🚚 Dispatched — En Route ({buyerTransactionStats.dispatchedCount})</option>
                  <option value="Completed">✅ Completed & Delivered ({buyerTransactionStats.completedCount})</option>
                  <option value="Cancelled by Farmer">❌ Cancelled by Farmer ({buyerTransactionStats.cancelledByFarmerCount})</option>
                  <option value="Cancelled by Buyer">🚫 Cancelled by Buyer ({buyerTransactionStats.cancelledByBuyerCount})</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">No orders found matching status "{statusFilter}"</h4>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredOrders.map((order) => (
                  <div key={order.orderId} className="p-5 md:p-6 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors space-y-3">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      
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
                            Seller Farmer: {order.farmerName} ({order.farmerPhone})
                          </p>
                        </div>
                      </div>

                      {/* STATUS BADGES INCLUDING CANCELLED BY FARMER */}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm ${
                          order.status === "Pending" ? "bg-amber-500 text-white" :
                          order.status === "Accepted" ? "bg-blue-600 text-white" :
                          order.status === "Dispatched" ? "bg-purple-600 text-white" :
                          order.status === "Completed" ? "bg-green-600 text-white" :
                          order.status === "Cancelled by Farmer" ? "bg-red-600 text-white" :
                          "bg-gray-600 text-white"
                        }`}>
                          {order.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
                          {order.status === "Accepted" && <Check className="w-3.5 h-3.5" />}
                          {order.status === "Dispatched" && <Truck className="w-3.5 h-3.5" />}
                          {order.status === "Completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {order.status === "Cancelled by Farmer" && <XCircle className="w-3.5 h-3.5" />}
                          {order.status === "Cancelled by Buyer" && <XCircle className="w-3.5 h-3.5" />}
                          
                          {order.status === "Pending" ? "⏳ Pending Farmer Approval" :
                           order.status === "Accepted" ? "🔵 Accepted by Farmer" :
                           order.status === "Dispatched" ? "🚚 Dispatched — En Route" :
                           order.status === "Completed" ? "✅ Completed & Delivered" :
                           order.status === "Cancelled by Farmer" ? "❌ Cancelled by Farmer" :
                           `Status: ${order.status}`}
                        </span>
                      </div>
                    </div>

                    {/* CANCELLATION REASON BANNER IF CANCELLED BY FARMER OR BUYER */}
                    {order.status === "Cancelled by Farmer" && (
                      <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-2xl border border-red-200 dark:border-red-900/60 text-xs font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <div>
                          <span>Farmer Cancellation Reason: </span>
                          <span className="font-normal">{order.cancellationReason || "Farmer was unable to fulfill order due to stock damage or weather."}</span>
                        </div>
                      </div>
                    )}

                    {order.status === "Cancelled by Buyer" && (
                      <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span>Buyer Cancellation Reason: </span>
                          <span className="font-normal">{order.cancellationReason || "Cancelled manually by customer."}</span>
                        </div>
                      </div>
                    )}

                    {/* Order Details Grid & Buyer Cancel Action */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-xs items-center">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Quantity</span>
                        <div className="font-extrabold text-gray-900 dark:text-white mt-0.5">{order.quantityQuintals} Quintals</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Rate / Quintal</span>
                        <div className="font-extrabold text-gray-900 dark:text-white mt-0.5">₹{order.pricePerQuintal.toLocaleString("en-IN")}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</span>
                        <div className="font-black text-green-700 dark:text-green-400 mt-0.5">₹{order.totalPrice.toLocaleString("en-IN")}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Delivery Address</span>
                        <div className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5 line-clamp-1">{order.buyerAddress}</div>
                      </div>

                      {/* BUYER CANCEL ORDER BUTTON */}
                      <div className="flex justify-end">
                        {!order.status.includes("Cancelled") && order.status !== "Completed" ? (
                          <button
                            onClick={() => {
                              const reason = prompt("Optional: Enter your reason for cancelling this order:") || "Cancelled manually by buyer";
                              const updated = orders.map(o => o.orderId === order.orderId ? { ...o, status: "Cancelled by Buyer" as const, cancellationReason: reason } : o);
                              setOrders(updated);
                              localStorage.setItem("agropulse_farmer_orders", JSON.stringify(updated));
                            }}
                            className="w-full md:w-auto bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-extrabold px-3 py-2 rounded-xl text-xs border border-red-200 dark:border-red-900 transition-all flex items-center justify-center gap-1 shadow-sm"
                          >
                            <XCircle className="w-3.5 h-3.5 text-red-600" /> Cancel Order
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Order Archived</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MULTI-STEP CHECKOUT MODAL */}
      <AnimatePresence>
        {buyingListing && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative space-y-6"
            >
              <button 
                onClick={() => setBuyingListing(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <span className="text-3xl p-2 bg-green-50 dark:bg-green-950/40 rounded-xl">{buyingListing.iconEmoji}</span>
                <div>
                  <span className="text-[10px] font-black text-green-700 uppercase">3-Step Checkout</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Buy {buyingListing.cropName}</h3>
                </div>
              </div>

              {checkoutStep === 1 && (
                <form onSubmit={handleProceedToReview} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-300">
                        Type or Select Quantity (Quintals):
                      </label>
                      <span className="text-[11px] font-extrabold text-green-600 dark:text-green-400">
                        Max Stock: {buyingListing.availableQuantityQuintals} Quintals
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const val = Math.max(1, orderQuantity - 1);
                          setOrderQuantity(val);
                          setQuantityInput(String(val));
                        }}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white font-black text-lg flex items-center justify-center hover:bg-gray-200"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="1"
                        max={buyingListing.availableQuantityQuintals}
                        value={quantityInput}
                        onChange={(e) => {
                          const valStr = e.target.value;
                          setQuantityInput(valStr);
                          const parsed = parseInt(valStr, 10);
                          if (!isNaN(parsed) && parsed > 0) {
                            setOrderQuantity(parsed);
                          }
                        }}
                        onBlur={() => {
                          const parsed = parseInt(quantityInput, 10);
                          if (isNaN(parsed) || parsed < 1) {
                            setOrderQuantity(1);
                            setQuantityInput("1");
                          } else if (parsed > buyingListing.availableQuantityQuintals) {
                            setOrderQuantity(buyingListing.availableQuantityQuintals);
                            setQuantityInput(String(buyingListing.availableQuantityQuintals));
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-base text-center text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                        placeholder="Type quantity manually..."
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const val = Math.min(buyingListing.availableQuantityQuintals, orderQuantity + 1);
                          setOrderQuantity(val);
                          setQuantityInput(String(val));
                        }}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white font-black text-lg flex items-center justify-center hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                      💡 You can click the text field and type any custom number manually (e.g. 5, 12, 50, 100).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">Your Full Name:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amitabh Verma"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">Phone Number:</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98200 11223"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Delivery Street Address:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Plot 42, Market Yard Road"
                      value={buyerStreet}
                      onChange={(e) => setBuyerStreet(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">City / Town:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pune"
                        value={buyerCity}
                        onChange={(e) => setBuyerCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">ZIP / Pincode:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 411037"
                        value={buyerPincode}
                        onChange={(e) => setBuyerPincode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-green-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-xs shadow-md mt-4"
                  >
                    Proceed to Order Summary & Confirmation →
                  </button>
                </form>
              )}

              {checkoutStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-2">
                    <h4 className="font-extrabold text-gray-900 dark:text-white uppercase text-[10px]">Itemized Invoice Breakdown</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Crop Subtotal ({orderQuantity} Quintals × ₹{buyingListing.pricePerQuintal}):</span>
                      <span className="font-bold">₹{checkoutCalculations.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Freight Transport Charge:</span>
                      <span className="font-bold">₹{checkoutCalculations.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-black text-sm text-green-700 dark:text-green-400">
                      <span>Total Amount Payable:</span>
                      <span>₹{checkoutCalculations.grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="flex-1 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl text-xs"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleFinalOrderSubmit}
                      className="flex-1 py-3 bg-green-600 text-white font-extrabold rounded-xl text-xs shadow-md"
                    >
                      Confirm & Place Purchase Order
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 3 && (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Order Confirmed Successfully!</h3>
                  <p className="text-xs text-gray-500 font-medium">Your purchase order for {orderQuantity} quintals of {buyingListing.cropName} has been transmitted directly to the farmer.</p>
                  
                  <button
                    onClick={() => {
                      setBuyingListing(null);
                      setActiveTab("my_orders");
                    }}
                    className="bg-green-600 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md"
                  >
                    View Order in My Orders
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSPECT CROP MODAL */}
      <AnimatePresence>
        {inspectingCrop && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative space-y-5"
            >
              <button 
                onClick={() => setInspectingCrop(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <img src={inspectingCrop.imageUrl} alt={inspectingCrop.cropName} className="w-24 h-24 rounded-2xl object-cover border" />
                <div>
                  <span className="text-xs font-black text-green-700 bg-green-100 px-2.5 py-0.5 rounded-md">{inspectingCrop.category}</span>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">{inspectingCrop.cropName}</h2>
                  <p className="text-xs text-gray-500 font-semibold">{inspectingCrop.village}, {inspectingCrop.district}, {inspectingCrop.state}</p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Price Rate</span>
                  <div className="text-xl font-black text-green-700">₹{inspectingCrop.pricePerQuintal.toLocaleString("en-IN")}/quintal</div>
                </div>
                <button
                  onClick={() => startCheckout(inspectingCrop)}
                  className="bg-green-600 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md text-xs"
                >
                  Buy This Crop Now
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => setInspectingCrop(null)} className="bg-gray-200 text-gray-800 font-bold px-5 py-2 rounded-xl text-xs">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
