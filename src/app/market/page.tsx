"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  X, Globe, Sprout, Info, Calendar, DollarSign, Droplets, ChevronRight, RefreshCw, BarChart2, Zap, Calculator, Landmark, ShieldCheck, ArrowRightLeft, Scale, Award, Eye, SlidersHorizontal, ArrowUpDown
} from "lucide-react";
import Link from "next/link";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export interface StatePriceDetail {
  state: string;
  district: string;
  mandiName: string;
  privatePrice: number;
  arrivalQuantity: string;
  trend: "up" | "down";
}

export interface CropItem {
  id: number;
  name: string;
  scientificName: string;
  category: "Cereals & Grains" | "Pulses & Legumes" | "Oilseeds" | "Vegetables" | "Fruits" | "Spices & Herbs" | "Commercial & Plantation" | "Nuts & Seeds";
  iconEmoji: string;
  state: string;
  district: string;
  mandiName: string;
  govt: number; // ₹/quintal (Govt MSP)
  private: number; // ₹/quintal (Private Mandi Rate)
  trend: "up" | "down";
  globalRegion: string;
  season: string;
  durationDays: string;
  avgYieldPerAcre: string;
  costPerAcre: number;
  demandLevel: "High" | "Moderate" | "Extremely High";
  soilType: string;
  moistureContent: string;
  qualityGrade: "Grade A Organic" | "Export Quality Premium" | "Grade A Superior" | "Standard Quality";
  lastUpdated: string;
  history: { month: string; govt: number; private: number }[];
  statePrices: StatePriceDetail[];
}

export const ALL_INDIAN_STATES = [
  "All States",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Gujarat",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Kerala",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Goa",
  "Haryana",
  "West Bengal"
];

export const COMPREHENSIVE_CROPS_DATABASE: CropItem[] = [
  // CEREALS & GRAINS
  {
    id: 1,
    name: "Wheat (Lokwan / Hard Red)",
    scientificName: "Triticum aestivum",
    category: "Cereals & Grains",
    iconEmoji: "🌾",
    state: "Maharashtra",
    district: "Pune",
    mandiName: "Baramati APMC",
    govt: 2275,
    private: 2550,
    trend: "up",
    globalRegion: "India, USA, Russia, China",
    season: "Rabi (Winter)",
    durationDays: "110 - 130 Days",
    avgYieldPerAcre: "18 - 22 Quintals",
    costPerAcre: 18000,
    demandLevel: "High",
    soilType: "Loamy & Alluvial Soil",
    moistureContent: "11.2% (Optimal)",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 02:45 PM",
    history: [{ month: "Jan", govt: 2100, private: 2200 }, { month: "Feb", govt: 2150, private: 2300 }, { month: "Mar", govt: 2150, private: 2250 }, { month: "Apr", govt: 2275, private: 2400 }, { month: "May", govt: 2275, private: 2550 }, { month: "Jun", govt: 2275, private: 2550 }],
    statePrices: [
      { state: "Maharashtra", district: "Pune", mandiName: "Baramati APMC", privatePrice: 2550, arrivalQuantity: "1,400 Quintals", trend: "up" },
      { state: "Punjab", district: "Ludhiana", mandiName: "Ludhiana Yard", privatePrice: 2420, arrivalQuantity: "4,500 Quintals", trend: "up" },
      { state: "Madhya Pradesh", district: "Ujjain", mandiName: "Ujjain Mandi", privatePrice: 2480, arrivalQuantity: "3,200 Quintals", trend: "up" }
    ]
  },
  {
    id: 2,
    name: "Rice (Basmati 1121)",
    scientificName: "Oryza sativa",
    category: "Cereals & Grains",
    iconEmoji: "🌾",
    state: "Punjab",
    district: "Ludhiana",
    mandiName: "Ludhiana Grain Market",
    govt: 2183,
    private: 4350,
    trend: "up",
    globalRegion: "India, Pakistan, SE Asia",
    season: "Kharif (Monsoon)",
    durationDays: "135 - 145 Days",
    avgYieldPerAcre: "16 - 20 Quintals",
    costPerAcre: 24000,
    demandLevel: "Extremely High",
    soilType: "Clayey & Heavy Alluvial Soil",
    moistureContent: "12.0% Standard",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 02:45 PM",
    history: [{ month: "Jan", govt: 2000, private: 3800 }, { month: "Feb", govt: 2050, private: 3950 }, { month: "Mar", govt: 2100, private: 4100 }, { month: "Apr", govt: 2183, private: 4150 }, { month: "May", govt: 2183, private: 4300 }, { month: "Jun", govt: 2183, private: 4350 }],
    statePrices: [
      { state: "Punjab", district: "Amritsar", mandiName: "Amritsar Mandi", privatePrice: 4350, arrivalQuantity: "6,800 Quintals", trend: "up" },
      { state: "Haryana", district: "Taraori", mandiName: "Taraori Yard", privatePrice: 4420, arrivalQuantity: "5,200 Quintals", trend: "up" }
    ]
  },

  // PULSES & LEGUMES
  {
    id: 3,
    name: "Chickpea / Chana (Desi)",
    scientificName: "Cicer arietinum",
    category: "Pulses & Legumes",
    iconEmoji: "🫘",
    state: "Madhya Pradesh",
    district: "Ujjain",
    mandiName: "Ujjain APMC",
    govt: 5440,
    private: 6250,
    trend: "up",
    globalRegion: "India, Australia, Middle East",
    season: "Rabi",
    durationDays: "100 - 120 Days",
    avgYieldPerAcre: "10 - 14 Quintals",
    costPerAcre: 14000,
    demandLevel: "High",
    soilType: "Black Cotton Soil",
    moistureContent: "10.5%",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 02:40 PM",
    history: [{ month: "Jan", govt: 5100, private: 5500 }, { month: "Feb", govt: 5250, private: 5700 }, { month: "Mar", govt: 5350, private: 5900 }, { month: "Apr", govt: 5440, private: 6050 }, { month: "May", govt: 5440, private: 6300 }, { month: "Jun", govt: 5440, private: 6250 }],
    statePrices: [
      { state: "Madhya Pradesh", district: "Ujjain", mandiName: "Ujjain APMC", privatePrice: 6250, arrivalQuantity: "3,400 Quintals", trend: "up" },
      { state: "Rajasthan", district: "Bikaner", mandiName: "Bikaner Yard", privatePrice: 6180, arrivalQuantity: "2,900 Quintals", trend: "up" }
    ]
  },
  {
    id: 4,
    name: "Pigeon Pea / Tur (Arhar Red)",
    scientificName: "Cajanus cajan",
    category: "Pulses & Legumes",
    iconEmoji: "🫘",
    state: "Maharashtra",
    district: "Latur",
    mandiName: "Latur APMC Pulse Yard",
    govt: 7000,
    private: 10200,
    trend: "up",
    globalRegion: "India, Myanmar, Africa",
    season: "Kharif",
    durationDays: "160 - 180 Days",
    avgYieldPerAcre: "8 - 12 Quintals",
    costPerAcre: 16000,
    demandLevel: "Extremely High",
    soilType: "Deep Black Soil",
    moistureContent: "10.0%",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 02:48 PM",
    history: [{ month: "Jan", govt: 6600, private: 8500 }, { month: "Feb", govt: 6800, private: 9000 }, { month: "Mar", govt: 6900, private: 9400 }, { month: "Apr", govt: 7000, private: 9750 }, { month: "May", govt: 7000, private: 10400 }, { month: "Jun", govt: 7000, private: 10200 }],
    statePrices: [
      { state: "Maharashtra", district: "Latur", mandiName: "Latur Yard", privatePrice: 10200, arrivalQuantity: "2,800 Quintals", trend: "up" },
      { state: "Karnataka", district: "Gulbarga", mandiName: "Kalaburagi APMC", privatePrice: 10450, arrivalQuantity: "3,400 Quintals", trend: "up" }
    ]
  },
  {
    id: 5,
    name: "Green Gram (Moong)",
    scientificName: "Vigna radiata",
    category: "Pulses & Legumes",
    iconEmoji: "🫘",
    state: "Rajasthan",
    district: "Nagaur",
    mandiName: "Nagaur APMC",
    govt: 8558,
    private: 9150,
    trend: "up",
    globalRegion: "India, China, SE Asia",
    season: "Kharif",
    durationDays: "60 - 75 Days",
    avgYieldPerAcre: "6 - 9 Quintals",
    costPerAcre: 11000,
    demandLevel: "High",
    soilType: "Loam Soil",
    moistureContent: "10.2%",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 02:38 PM",
    history: [{ month: "Jan", govt: 7755, private: 8200 }, { month: "Feb", govt: 8000, private: 8500 }, { month: "Mar", govt: 8558, private: 8800 }, { month: "Apr", govt: 8558, private: 9000 }, { month: "May", govt: 8558, private: 9250 }, { month: "Jun", govt: 8558, private: 9150 }],
    statePrices: [
      { state: "Rajasthan", district: "Nagaur", mandiName: "Nagaur APMC", privatePrice: 9150, arrivalQuantity: "1,500 Quintals", trend: "up" }
    ]
  },

  // VEGETABLES
  {
    id: 6,
    name: "Onion (Nashik Red)",
    scientificName: "Allium cepa",
    category: "Vegetables",
    iconEmoji: "🧅",
    state: "Maharashtra",
    district: "Nashik",
    mandiName: "Lasalgaon APMC",
    govt: 1200,
    private: 1850,
    trend: "up",
    globalRegion: "Global",
    season: "Kharif & Rabi",
    durationDays: "120 - 140 Days",
    avgYieldPerAcre: "80 - 120 Quintals",
    costPerAcre: 35000,
    demandLevel: "Extremely High",
    soilType: "Deep Alluvial Loam Soil",
    moistureContent: "Fresh Cured",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 02:50 PM",
    history: [{ month: "Jan", govt: 1000, private: 1100 }, { month: "Feb", govt: 1100, private: 1300 }, { month: "Mar", govt: 1150, private: 1450 }, { month: "Apr", govt: 1200, private: 1600 }, { month: "May", govt: 1200, private: 1750 }, { month: "Jun", govt: 1200, private: 1850 }],
    statePrices: [
      { state: "Maharashtra", district: "Nashik", mandiName: "Lasalgaon APMC", privatePrice: 1850, arrivalQuantity: "9,200 Quintals", trend: "up" },
      { state: "Karnataka", district: "Hubli", mandiName: "Hubli Yard", privatePrice: 1980, arrivalQuantity: "4,100 Quintals", trend: "up" }
    ]
  },
  {
    id: 7,
    name: "Tomato (Hybrid Red)",
    scientificName: "Solanum lycopersicum",
    category: "Vegetables",
    iconEmoji: "🍅",
    state: "Karnataka",
    district: "Kolar",
    mandiName: "Kolar APMC",
    govt: 800,
    private: 1650,
    trend: "up",
    globalRegion: "Global",
    season: "All Season",
    durationDays: "120 - 150 Days",
    avgYieldPerAcre: "120 - 180 Quintals",
    costPerAcre: 45000,
    demandLevel: "Extremely High",
    soilType: "Loam Soil",
    moistureContent: "Fresh Farm Harvest",
    qualityGrade: "Standard Quality",
    lastUpdated: "Live Today 02:52 PM",
    history: [{ month: "Jan", govt: 600, private: 700 }, { month: "Feb", govt: 650, private: 850 }, { month: "Mar", govt: 700, private: 1000 }, { month: "Apr", govt: 750, private: 1200 }, { month: "May", govt: 800, private: 1550 }, { month: "Jun", govt: 800, private: 1650 }],
    statePrices: [
      { state: "Karnataka", district: "Kolar", mandiName: "Kolar APMC", privatePrice: 1650, arrivalQuantity: "5,200 Quintals", trend: "up" }
    ]
  },

  // FRUITS
  {
    id: 8,
    name: "Mango (Alphonso / Kesar)",
    scientificName: "Mangifera indica",
    category: "Fruits",
    iconEmoji: "🥭",
    state: "Maharashtra",
    district: "Ratnagiri",
    mandiName: "Ratnagiri APMC",
    govt: 9000,
    private: 18500,
    trend: "up",
    globalRegion: "India, Thailand, Mexico",
    season: "Summer",
    durationDays: "Perennial Tree Crop",
    avgYieldPerAcre: "40 - 60 Quintals",
    costPerAcre: 30000,
    demandLevel: "Extremely High",
    soilType: "Lateritic Soil",
    moistureContent: "Fresh Harvest",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 02:55 PM",
    history: [{ month: "Jan", govt: 7000, private: 12000 }, { month: "Feb", govt: 8000, private: 14500 }, { month: "Mar", govt: 8500, private: 16000 }, { month: "Apr", govt: 9000, private: 18000 }, { month: "May", govt: 9000, private: 19500 }, { month: "Jun", govt: 9000, private: 18500 }],
    statePrices: [
      { state: "Maharashtra", district: "Ratnagiri", mandiName: "Ratnagiri Yard", privatePrice: 18500, arrivalQuantity: "650 Crates", trend: "up" },
      { state: "Gujarat", district: "Junagadh", mandiName: "Talala Gir Yard", privatePrice: 14800, arrivalQuantity: "1,200 Crates", trend: "up" }
    ]
  },
  {
    id: 9,
    name: "Apple (Shimla / Kashmiri Red)",
    scientificName: "Malus domestica",
    category: "Fruits",
    iconEmoji: "🍎",
    state: "Himachal Pradesh",
    district: "Shimla",
    mandiName: "Dhalli Fruit Market",
    govt: 7500,
    private: 11800,
    trend: "up",
    globalRegion: "Global Temperate Belts",
    season: "Autumn Harvesting",
    durationDays: "Perennial Orchard",
    avgYieldPerAcre: "50 - 80 Quintals",
    costPerAcre: 60000,
    demandLevel: "High",
    soilType: "Deep Mountain Loam",
    moistureContent: "Crisp Fresh",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 02:30 PM",
    history: [{ month: "Jan", govt: 6800, private: 9200 }, { month: "Feb", govt: 7000, private: 9900 }, { month: "Mar", govt: 7200, private: 10500 }, { month: "Apr", govt: 7500, private: 11000 }, { month: "May", govt: 7500, private: 12100 }, { month: "Jun", govt: 7500, private: 11800 }],
    statePrices: [
      { state: "Himachal Pradesh", district: "Shimla", mandiName: "Dhalli Yard", privatePrice: 11800, arrivalQuantity: "3,200 Boxes", trend: "up" },
      { state: "Jammu & Kashmir", district: "Sopore", mandiName: "Sopore Fruit Mandi", privatePrice: 12500, arrivalQuantity: "5,400 Boxes", trend: "up" }
    ]
  }
];

const CATEGORIES = [
  "All Categories",
  "Cereals & Grains",
  "Pulses & Legumes",
  "Oilseeds",
  "Vegetables",
  "Fruits",
  "Spices & Herbs",
  "Commercial & Plantation",
  "Nuts & Seeds"
];

export default function MarketPricesPage() {
  const [cropsData, setCropsData] = useState<CropItem[]>(COMPREHENSIVE_CROPS_DATABASE);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStateFilter, setSelectedStateFilter] = useState("All States");
  const [sortOption, setSortOption] = useState<"default" | "low_high" | "high_low" | "best_quality" | "highest_margin">("default");
  
  const [inspectedCrop, setInspectedCrop] = useState<CropItem | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Comparison Tool State inside Modal
  const [compareCrop, setCompareCrop] = useState<CropItem>(COMPREHENSIVE_CROPS_DATABASE[0]);
  const [compareStateA, setCompareStateA] = useState<string>("Maharashtra");
  const [compareStateB, setCompareStateB] = useState<string>("Punjab");

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Profit Calculator State
  const [calcYieldAcre, setCalcYieldAcre] = useState<number>(20);
  const [calcCostAcre, setCalcCostAcre] = useState<number>(18000);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestionsList = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();
    return cropsData.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.scientificName.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term) ||
      c.district.toLowerCase().includes(term) ||
      c.state.toLowerCase().includes(term)
    );
  }, [cropsData, searchTerm]);

  const filteredAndSortedCrops = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    
    // 1. Filter
    const filtered = cropsData.filter((crop) => {
      const matchSearch = !term || 
        crop.name.toLowerCase().includes(term) ||
        crop.scientificName.toLowerCase().includes(term) ||
        crop.category.toLowerCase().includes(term) ||
        crop.state.toLowerCase().includes(term) ||
        crop.district.toLowerCase().includes(term);

      const matchCategory = selectedCategory === "All Categories" || crop.category === selectedCategory;
      const matchState = selectedStateFilter === "All States" || crop.state === selectedStateFilter || crop.statePrices.some(sp => sp.state === selectedStateFilter);

      return matchSearch && matchCategory && matchState;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sortOption === "low_high") {
        return a.private - b.private;
      }
      if (sortOption === "high_low") {
        return b.private - a.private;
      }
      if (sortOption === "best_quality") {
        const qualityRank = { "Export Quality Premium": 4, "Grade A Organic": 3, "Grade A Superior": 2, "Standard Quality": 1 };
        return qualityRank[b.qualityGrade] - qualityRank[a.qualityGrade];
      }
      if (sortOption === "highest_margin") {
        const marginA = ((a.private - a.govt) / a.govt);
        const marginB = ((b.private - b.govt) / b.govt);
        return marginB - marginA;
      }
      return 0;
    });
  }, [cropsData, searchTerm, selectedCategory, selectedStateFilter, sortOption]);

  const marketOverviewStats = useMemo(() => {
    const totalCrops = cropsData.length;
    const avgGovtMSP = Math.round(cropsData.reduce((s, c) => s + c.govt, 0) / totalCrops);
    const avgPrivateRate = Math.round(cropsData.reduce((s, c) => s + c.private, 0) / totalCrops);
    const premiumMargin = Math.round(((avgPrivateRate - avgGovtMSP) / avgGovtMSP) * 100);
    return { totalCrops, avgGovtMSP, avgPrivateRate, premiumMargin };
  }, [cropsData]);

  const handleLiveRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const updated = cropsData.map(c => {
        const delta = (Math.random() - 0.48) * 0.03;
        const newPrivate = Math.round(c.private * (1 + delta));
        return {
          ...c,
          private: newPrivate,
          trend: newPrivate >= c.govt ? "up" as const : "down" as const,
          lastUpdated: `Live Just Now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
        };
      });
      setCropsData(updated);
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSelectSuggestion = (crop: CropItem) => {
    setSearchTerm(crop.name);
    setShowSuggestions(false);
    setInspectedCrop(crop);
    const numYield = parseInt(crop.avgYieldPerAcre) || 20;
    setCalcYieldAcre(numYield);
    setCalcCostAcre(crop.costPerAcre);
  };

  // State Comparison calculations
  const priceStateA = useMemo(() => {
    return compareCrop.statePrices.find(sp => sp.state === compareStateA) || compareCrop.statePrices[0];
  }, [compareCrop, compareStateA]);

  const priceStateB = useMemo(() => {
    return compareCrop.statePrices.find(sp => sp.state === compareStateB) || compareCrop.statePrices[1] || compareCrop.statePrices[0];
  }, [compareCrop, compareStateB]);

  const priceDiff = useMemo(() => {
    if (!priceStateA || !priceStateB) return 0;
    return priceStateA.privatePrice - priceStateB.privatePrice;
  }, [priceStateA, priceStateB]);

  const comparisonChartData = useMemo(() => {
    if (!priceStateA || !priceStateB) return [];
    return [
      { state: `${compareStateA} (${priceStateA.district})`, "Private Mandi Rate": priceStateA.privatePrice, "Govt MSP": compareCrop.govt },
      { state: `${compareStateB} (${priceStateB.district})`, "Private Mandi Rate": priceStateB.privatePrice, "Govt MSP": compareCrop.govt }
    ];
  }, [priceStateA, priceStateB, compareStateA, compareStateB, compareCrop]);

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto space-y-6">
      
      {/* Top Header & Launch Comparison Button */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-green-200 dark:border-green-800">
              🏛️ Live Mandi Rates & Inter-State Index
            </span>
            <span className="text-xs text-gray-400 font-semibold">• Real-Time Agmarknet Feed</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <Globe className="w-8 h-8 text-green-600 dark:text-green-400 shrink-0" />
            Market Prices & Crop Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-xs md:text-sm font-medium">Compare official Government Minimum Support Price (MSP) with live Private Trader rates across all Indian States.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCompareModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs shadow-md transition-all flex items-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>⚖️ Compare State vs State Rates</span>
          </button>

          <button
            onClick={handleLiveRefresh}
            disabled={isRefreshing}
            className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Prices"}</span>
          </button>
        </div>
      </header>

      {/* PROMINENT SEARCH BAR WITH INTEGRATED SORT & FILTER CONTROLS */}
      <div ref={searchContainerRef} className="relative z-40 bg-white dark:bg-[#1a1b23] p-4 md:p-5 rounded-3xl shadow-lg border-2 border-green-500/30 space-y-4">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (suggestionsList.length > 0) {
              handleSelectSuggestion(suggestionsList[0]);
            } else if (filteredAndSortedCrops.length > 0) {
              handleSelectSuggestion(filteredAndSortedCrops[0]);
            }
          }}
          className="relative"
        >
          <Search className="absolute left-4 top-4 h-5 w-5 text-green-600 dark:text-green-400" />
          <input
            type="text"
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (suggestionsList.length > 0) {
                  handleSelectSuggestion(suggestionsList[0]);
                } else if (filteredAndSortedCrops.length > 0) {
                  handleSelectSuggestion(filteredAndSortedCrops[0]);
                }
              }
            }}
            className="block w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 text-sm md:text-base font-extrabold bg-gray-50 dark:bg-white/5 transition-all shadow-inner"
            placeholder="🔍 Type crop name, fruit, state, or district and press ENTER..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
          />
          {searchTerm && (
            <button 
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 bg-gray-200 dark:bg-white/10 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* SORT & FILTER OPTIONS ROW INSIDE SEARCH BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-white/5 text-xs font-bold">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-green-600" />
            <span className="text-gray-500 font-extrabold">Sort Searched Crops:</span>
            <select
              value={sortOption}
              onChange={(e: any) => setSortOption(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="default">Default Relevance</option>
              <option value="low_high">💲 Lowest Price to Highest Price</option>
              <option value="high_low">💰 Highest Price to Lowest Price</option>
              <option value="best_quality">⭐ Best Quality / Premium Grade</option>
              <option value="highest_margin">📈 Highest Profit Margin (% over MSP)</option>
            </select>
          </div>

          <div className="text-gray-500 dark:text-gray-400 font-extrabold">
            Showing <strong className="text-green-600 dark:text-green-400">{filteredAndSortedCrops.length}</strong> searched crops
          </div>
        </div>

        {/* FLOATING INSTANT SUGGESTIONS DROPDOWN */}
        <AnimatePresence>
          {showSuggestions && suggestionsList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute left-0 right-0 top-[102%] bg-white dark:bg-[#1a1b23] border border-green-500/40 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5 z-50 p-2"
            >
              <div className="p-2 text-[10px] font-black text-gray-400 uppercase tracking-wider flex justify-between">
                <span>Instant Auto-Suggestions ({suggestionsList.length} matches)</span>
                <span>Click to view analytics</span>
              </div>
              {suggestionsList.map((crop) => (
                <div
                  key={crop.id}
                  onClick={() => handleSelectSuggestion(crop)}
                  className="p-3 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1.5 bg-gray-100 dark:bg-white/5 rounded-xl">{crop.iconEmoji}</span>
                    <div>
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-xs group-hover:text-green-600 transition-colors flex items-center gap-1.5">
                        {crop.name} <span className="text-[10px] text-gray-400 italic">({crop.scientificName})</span>
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold mt-0.5">
                        <span className="text-green-700 dark:text-green-400 font-bold">{crop.category}</span>
                        <span>•</span>
                        <span>{crop.district}, {crop.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 block">Private Rate</span>
                    <span className="text-xs font-black text-green-700 dark:text-green-400">₹{crop.private.toLocaleString("en-IN")}/q</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-green-600">
          <span className="text-xs font-extrabold text-gray-400 uppercase">Tracked World Commodities</span>
          <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">{marketOverviewStats.totalCrops} Crops & Fruits</div>
          <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">across 8 Crop Categories</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-blue-600">
          <span className="text-xs font-extrabold text-gray-400 uppercase">Average Govt MSP</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">₹{marketOverviewStats.avgGovtMSP.toLocaleString("en-IN")}<span className="text-xs text-gray-400">/q</span></div>
          <span className="text-[10px] text-gray-400 font-semibold">Official Govt Rate</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-emerald-500">
          <span className="text-xs font-extrabold text-gray-400 uppercase">Average Private Rate</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹{marketOverviewStats.avgPrivateRate.toLocaleString("en-IN")}<span className="text-xs text-gray-400">/q</span></div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Active Private Mandi Price</span>
        </div>

        <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm border-l-4 border-l-amber-500">
          <span className="text-xs font-extrabold text-gray-400 uppercase">Average Trader Premium</span>
          <div className="text-2xl font-black text-amber-500 mt-1">+{marketOverviewStats.premiumMargin}% Above MSP</div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">High Buyer Demand</span>
        </div>
      </div>

      {/* Category Tabs & State Filter Controls */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap border shrink-0 ${
                selectedCategory === cat
                  ? "bg-green-600 border-green-600 text-white shadow-md"
                  : "bg-white dark:bg-[#1a1b23] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-green-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
          <span className="text-gray-400 font-bold shrink-0">Filter by State:</span>
          {ALL_INDIAN_STATES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStateFilter(st)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
                selectedStateFilter === st
                  ? "bg-amber-500 text-white border-amber-500 font-bold"
                  : "bg-white dark:bg-[#1a1b23] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCHED CROPS LISTING GRID */}
      {filteredAndSortedCrops.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl p-12 text-center shadow-sm my-8">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No crop found matching "{searchTerm}"</h3>
          <button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("All Categories"); setSelectedStateFilter("All States"); setSortOption("default"); }}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-extrabold text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span>List of Searched & Filtered Crops ({filteredAndSortedCrops.length}):</span>
            <span className="text-green-600 dark:text-green-400">Sorted by {sortOption.replace('_', ' ').toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSortedCrops.map((crop) => {
              const profitDiff = crop.private - crop.govt;
              const profitPercent = Math.round((profitDiff / crop.govt) * 100);

              return (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    setInspectedCrop(crop);
                    const numYield = parseInt(crop.avgYieldPerAcre) || 20;
                    setCalcYieldAcre(numYield);
                    setCalcCostAcre(crop.costPerAcre);
                  }}
                  className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-green-500 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-2xl p-2 bg-green-50 dark:bg-green-950/40 rounded-xl">
                        {crop.iconEmoji}
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5" /> +{profitPercent}% over MSP
                        </span>
                        <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md">
                          ⭐ {crop.qualityGrade}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-gray-900 dark:text-white text-base group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {crop.name}
                    </h3>
                    <p className="text-xs font-medium text-gray-400 italic mt-0.5">{crop.scientificName}</p>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{crop.district}, {crop.state}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                        {crop.statePrices.length} States Priced
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-2.5 rounded-xl text-center">
                      <div className="text-[10px] font-extrabold text-blue-700 dark:text-blue-400 uppercase">Govt MSP Rate</div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">₹{crop.govt.toLocaleString("en-IN")}/q</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 p-2.5 rounded-xl text-center">
                      <div className="text-[10px] font-extrabold text-green-700 dark:text-green-400 uppercase">Private Mandi Rate</div>
                      <div className="text-xs font-extrabold text-green-700 dark:text-green-400 mt-0.5">₹{crop.private.toLocaleString("en-IN")}/q</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-green-600 dark:text-green-400">
                    <span className="text-[10px] text-gray-400 font-medium">{crop.lastUpdated}</span>
                    <span className="flex items-center group-hover:translate-x-1 transition-transform">
                      Detailed Analytics <ChevronRight className="w-4 h-4 ml-0.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL CROP INSPECTION MODAL */}
      <AnimatePresence>
        {inspectedCrop && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8 space-y-6"
            >
              <button 
                onClick={() => setInspectedCrop(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="text-4xl p-3 bg-green-50 dark:bg-green-950/50 rounded-2xl border border-green-200 shrink-0">
                  {inspectedCrop.iconEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-md">
                      {inspectedCrop.category}
                    </span>
                    <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-md">
                      ⭐ {inspectedCrop.qualityGrade}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-1">
                    {inspectedCrop.name}
                  </h2>
                  <p className="text-xs text-gray-400 italic font-medium">{inspectedCrop.scientificName} • Key Mandi: {inspectedCrop.district}, {inspectedCrop.state}</p>
                </div>
              </div>

              {/* Real-Time Price Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-black text-blue-700 uppercase">Govt MSP Rate</span>
                  <div className="text-xl font-black text-blue-700 mt-1">₹{inspectedCrop.govt.toLocaleString("en-IN")}/q</div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-black text-green-700 uppercase">Private Trader Rate</span>
                  <div className="text-xl font-black text-green-700 mt-1">₹{inspectedCrop.private.toLocaleString("en-IN")}/q</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 p-4 rounded-2xl">
                  <span className="text-[10px] font-black text-amber-700 uppercase">Buying Demand</span>
                  <div className="text-base font-black text-amber-700 mt-1">{inspectedCrop.demandLevel}</div>
                </div>
              </div>

              {/* Multi-State Price Breakdown */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-black uppercase text-gray-900 dark:text-white tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-green-600" /> Rates Across Multiple Indian States
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {inspectedCrop.statePrices.map((sp) => (
                    <div key={sp.state} className="bg-white dark:bg-[#1a1b23] p-3 rounded-xl border border-gray-200 dark:border-white/10 text-xs">
                      <div className="flex justify-between font-extrabold text-gray-900 dark:text-white">
                        <span>{sp.state}</span>
                        <span className="text-green-600">₹{sp.privatePrice.toLocaleString("en-IN")}/q</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{sp.mandiName} ({sp.district})</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6-Month Chart */}
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-3">6-Month Price Trend</h4>
                <div className="h-56 min-h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={inspectedCrop.history}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <RechartsTooltip />
                      <Line type="monotone" name="Govt MSP" dataKey="govt" stroke="#3b82f6" strokeWidth={3} />
                      <Line type="monotone" name="Private Rate" dataKey="private" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Profit Calculator */}
              <div className="bg-green-50/50 p-4 rounded-2xl space-y-3 border border-green-100">
                <h4 className="text-xs font-black text-green-800 uppercase flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" /> Est. Net Profit Calculator per Acre
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Expected Yield (Quintals/Acre):</label>
                    <input
                      type="number"
                      value={calcYieldAcre}
                      onChange={(e) => setCalcYieldAcre(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl font-bold bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Cultivation Cost / Acre (₹):</label>
                    <input
                      type="number"
                      value={calcCostAcre}
                      onChange={(e) => setCalcCostAcre(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl font-bold bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t text-xs">
                  <span className="font-bold text-gray-600">Est. Net Profit:</span>
                  <span className="text-base font-black text-green-700">
                    ₹{((calcYieldAcre * inspectedCrop.private) - calcCostAcre).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button 
                  onClick={() => setInspectedCrop(null)}
                  className="bg-gray-200 text-gray-800 font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Close Analytics
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STATE-VS-STATE COMPARISON MODAL */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-3xl w-full p-6 md:p-8 relative shadow-2xl space-y-5"
            >
              <button 
                onClick={() => setShowCompareModal(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <Scale className="w-7 h-7 text-amber-500" />
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Inter-State Price Comparison Tool</h3>
                  <p className="text-xs text-gray-400 font-medium">Select any crop or fruit to compare mandi rates between 2 Indian States.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-1">Select Commodity:</label>
                  <select
                    value={compareCrop.name}
                    onChange={(e) => {
                      const found = cropsData.find(c => c.name === e.target.value);
                      if (found) setCompareCrop(found);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-xs text-gray-900 dark:text-white"
                  >
                    {cropsData.map(c => <option key={c.id} value={c.name}>{c.iconEmoji} {c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-1">State A:</label>
                  <select
                    value={compareStateA}
                    onChange={(e) => setCompareStateA(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-xs text-gray-900 dark:text-white"
                  >
                    {compareCrop.statePrices.map(sp => <option key={sp.state} value={sp.state}>{sp.state}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-1">State B:</label>
                  <select
                    value={compareStateB}
                    onChange={(e) => setCompareStateB(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-xs text-gray-900 dark:text-white"
                  >
                    {compareCrop.statePrices.map(sp => <option key={sp.state} value={sp.state}>{sp.state}</option>)}
                  </select>
                </div>
              </div>

              {priceStateA && priceStateB ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs font-bold text-amber-800 dark:text-amber-300">
                    {priceDiff > 0 ? (
                      <span>Selling {compareCrop.name} in <strong>{compareStateA}</strong> gives <strong>+₹{priceDiff.toLocaleString("en-IN")}/quintal</strong> higher rate than {compareStateB}!</span>
                    ) : priceDiff < 0 ? (
                      <span>Selling {compareCrop.name} in <strong>{compareStateB}</strong> gives <strong>+₹{Math.abs(priceDiff).toLocaleString("en-IN")}/quintal</strong> higher rate than {compareStateA}!</span>
                    ) : (
                      <span>Both states are trading at identical Mandi prices.</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200">
                      <span className="font-black text-green-700 uppercase">{compareStateA}</span>
                      <div className="text-xl font-black text-green-700 mt-1">₹{priceStateA.privatePrice.toLocaleString("en-IN")}/q</div>
                      <div className="text-[10px] text-gray-500 mt-1">{priceStateA.mandiName} ({priceStateA.district})</div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200">
                      <span className="font-black text-blue-700 uppercase">{compareStateB}</span>
                      <div className="text-xl font-black text-blue-700 mt-1">₹{priceStateB.privatePrice.toLocaleString("en-IN")}/q</div>
                      <div className="text-[10px] text-gray-500 mt-1">{priceStateB.mandiName} ({priceStateB.district})</div>
                    </div>
                  </div>

                  <div className="h-56 min-h-[220px] w-full bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="state" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                        <RechartsTooltip />
                        <Bar dataKey="Govt MSP" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Private Mandi Rate" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="bg-gray-200 text-gray-800 font-bold px-5 py-2 rounded-xl text-xs"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
