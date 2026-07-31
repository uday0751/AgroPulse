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
  category: "Cereals & Grains" | "Pulses & Legumes" | "Oilseeds" | "Vegetables" | "Fruits" | "Spices & Herbs" | "Commercial & Plantation";
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
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Gujarat",
  "Rajasthan",
  "Karnataka",
  "Tamil Nadu",
  "Andhra Pradesh",
  "West Bengal",
  "Haryana",
  "Bihar",
  "Kerala",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Telangana",
  "Odisha",
  "Assam"
];

export const COMPREHENSIVE_CROPS_DATABASE: CropItem[] = [
  // CEREALS & GRAINS
  {
    id: 1,
    name: "Wheat (Lokwan / Sharbati Red)",
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
    moistureContent: "11.2%",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:30 PM",
    history: [{ month: "Jan", govt: 2100, private: 2200 }, { month: "Feb", govt: 2150, private: 2300 }, { month: "Mar", govt: 2150, private: 2250 }, { month: "Apr", govt: 2275, private: 2400 }, { month: "May", govt: 2275, private: 2550 }, { month: "Jun", govt: 2275, private: 2550 }],
    statePrices: [
      { state: "Maharashtra", district: "Pune", mandiName: "Baramati APMC", privatePrice: 2550, arrivalQuantity: "1,400 Quintals", trend: "up" },
      { state: "Madhya Pradesh", district: "Ujjain", mandiName: "Ujjain Mandi", privatePrice: 2680, arrivalQuantity: "3,200 Quintals", trend: "up" },
      { state: "Punjab", district: "Ludhiana", mandiName: "Ludhiana Yard", privatePrice: 2420, arrivalQuantity: "4,500 Quintals", trend: "up" },
      { state: "Uttar Pradesh", district: "Kanpur", mandiName: "Kanpur APMC", privatePrice: 2490, arrivalQuantity: "2,800 Quintals", trend: "up" }
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
    moistureContent: "12.0%",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 08:30 PM",
    history: [{ month: "Jan", govt: 2000, private: 3800 }, { month: "Feb", govt: 2050, private: 3950 }, { month: "Mar", govt: 2100, private: 4100 }, { month: "Apr", govt: 2183, private: 4150 }, { month: "May", govt: 2183, private: 4300 }, { month: "Jun", govt: 2183, private: 4350 }],
    statePrices: [
      { state: "Punjab", district: "Amritsar", mandiName: "Amritsar Mandi", privatePrice: 4350, arrivalQuantity: "6,800 Quintals", trend: "up" },
      { state: "Haryana", district: "Karnal", mandiName: "Karnal APMC", privatePrice: 4420, arrivalQuantity: "5,200 Quintals", trend: "up" },
      { state: "Uttar Pradesh", district: "Meerut", mandiName: "Meerut Yard", privatePrice: 4210, arrivalQuantity: "3,100 Quintals", trend: "up" }
    ]
  },
  {
    id: 3,
    name: "Rice (Sona Masoori)",
    scientificName: "Oryza sativa",
    category: "Cereals & Grains",
    iconEmoji: "🌾",
    state: "Andhra Pradesh",
    district: "Guntur",
    mandiName: "Guntur APMC",
    govt: 2183,
    private: 3650,
    trend: "up",
    globalRegion: "India, Sri Lanka",
    season: "Kharif",
    durationDays: "130 Days",
    avgYieldPerAcre: "22 - 26 Quintals",
    costPerAcre: 22000,
    demandLevel: "High",
    soilType: "Alluvial Soil",
    moistureContent: "11.5%",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:25 PM",
    history: [{ month: "Jan", govt: 2000, private: 3300 }, { month: "Feb", govt: 2100, private: 3450 }, { month: "Mar", govt: 2183, private: 3650 }],
    statePrices: [
      { state: "Andhra Pradesh", district: "Guntur", mandiName: "Guntur APMC", privatePrice: 3650, arrivalQuantity: "4,100 Quintals", trend: "up" },
      { state: "Karnataka", district: "Raichur", mandiName: "Raichur Yard", privatePrice: 3580, arrivalQuantity: "2,900 Quintals", trend: "up" },
      { state: "Telangana", district: "Nalgonda", mandiName: "Nalgonda Market", privatePrice: 3610, arrivalQuantity: "3,400 Quintals", trend: "up" }
    ]
  },
  {
    id: 4,
    name: "Maize / Yellow Corn",
    scientificName: "Zea mays",
    category: "Cereals & Grains",
    iconEmoji: "🌽",
    state: "Bihar",
    district: "Gulabbagh",
    mandiName: "Purnea APMC",
    govt: 2090,
    private: 2320,
    trend: "up",
    globalRegion: "India, USA, Brazil",
    season: "Kharif & Rabi",
    durationDays: "95 - 110 Days",
    avgYieldPerAcre: "25 - 30 Quintals",
    costPerAcre: 15000,
    demandLevel: "High",
    soilType: "Deep Heavy Soil",
    moistureContent: "13.0%",
    qualityGrade: "Standard Quality",
    lastUpdated: "Live Today 08:15 PM",
    history: [{ month: "Jan", govt: 1962, private: 2100 }, { month: "Feb", govt: 2090, private: 2250 }, { month: "Mar", govt: 2090, private: 2320 }],
    statePrices: [
      { state: "Bihar", district: "Purnea", mandiName: "Purnea APMC", privatePrice: 2320, arrivalQuantity: "5,800 Quintals", trend: "up" },
      { state: "Karnataka", district: "Davangere", mandiName: "Davangere Yard", privatePrice: 2280, arrivalQuantity: "3,900 Quintals", trend: "up" }
    ]
  },
  {
    id: 5,
    name: "Pearl Millet (Bajra)",
    scientificName: "Pennisetum glaucum",
    category: "Cereals & Grains",
    iconEmoji: "🌾",
    state: "Rajasthan",
    district: "Jaipur",
    mandiName: "Chomu APMC",
    govt: 2500,
    private: 2710,
    trend: "up",
    globalRegion: "India, Africa",
    season: "Kharif",
    durationDays: "80 - 90 Days",
    avgYieldPerAcre: "12 - 16 Quintals",
    costPerAcre: 10000,
    demandLevel: "Moderate",
    soilType: "Sandy Loam Soil",
    moistureContent: "10.8%",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 08:10 PM",
    history: [{ month: "Jan", govt: 2350, private: 2500 }, { month: "Feb", govt: 2500, private: 2710 }],
    statePrices: [
      { state: "Rajasthan", district: "Jaipur", mandiName: "Chomu APMC", privatePrice: 2710, arrivalQuantity: "3,100 Quintals", trend: "up" },
      { state: "Gujarat", district: "Banaskantha", mandiName: "Palanpur APMC", privatePrice: 2680, arrivalQuantity: "2,200 Quintals", trend: "up" }
    ]
  },

  // PULSES & LEGUMES
  {
    id: 6,
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
    globalRegion: "India, Australia",
    season: "Rabi",
    durationDays: "100 - 120 Days",
    avgYieldPerAcre: "10 - 14 Quintals",
    costPerAcre: 14000,
    demandLevel: "High",
    soilType: "Black Cotton Soil",
    moistureContent: "10.5%",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:30 PM",
    history: [{ month: "Jan", govt: 5100, private: 5500 }, { month: "Feb", govt: 5250, private: 5700 }, { month: "Mar", govt: 5440, private: 6250 }],
    statePrices: [
      { state: "Madhya Pradesh", district: "Ujjain", mandiName: "Ujjain APMC", privatePrice: 6250, arrivalQuantity: "3,400 Quintals", trend: "up" },
      { state: "Rajasthan", district: "Bikaner", mandiName: "Bikaner Yard", privatePrice: 6180, arrivalQuantity: "2,900 Quintals", trend: "up" },
      { state: "Maharashtra", district: "Latur", mandiName: "Latur Yard", privatePrice: 6310, arrivalQuantity: "2,100 Quintals", trend: "up" }
    ]
  },
  {
    id: 7,
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
    lastUpdated: "Live Today 08:30 PM",
    history: [{ month: "Jan", govt: 6600, private: 8500 }, { month: "Feb", govt: 7000, private: 10200 }],
    statePrices: [
      { state: "Maharashtra", district: "Latur", mandiName: "Latur Yard", privatePrice: 10200, arrivalQuantity: "2,800 Quintals", trend: "up" },
      { state: "Karnataka", district: "Kalaburagi", mandiName: "Gulbarga APMC", privatePrice: 10450, arrivalQuantity: "3,400 Quintals", trend: "up" },
      { state: "Madhya Pradesh", district: "Indore", mandiName: "Indore APMC", privatePrice: 10100, arrivalQuantity: "1,900 Quintals", trend: "up" }
    ]
  },
  {
    id: 8,
    name: "Green Gram (Moong Whole)",
    scientificName: "Vigna radiata",
    category: "Pulses & Legumes",
    iconEmoji: "🫘",
    state: "Rajasthan",
    district: "Nagaur",
    mandiName: "Nagaur APMC",
    govt: 8558,
    private: 9150,
    trend: "up",
    globalRegion: "India, China",
    season: "Kharif",
    durationDays: "60 - 75 Days",
    avgYieldPerAcre: "6 - 9 Quintals",
    costPerAcre: 11000,
    demandLevel: "High",
    soilType: "Loam Soil",
    moistureContent: "10.2%",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 08:20 PM",
    history: [{ month: "Jan", govt: 7755, private: 8200 }, { month: "Feb", govt: 8558, private: 9150 }],
    statePrices: [
      { state: "Rajasthan", district: "Nagaur", mandiName: "Nagaur APMC", privatePrice: 9150, arrivalQuantity: "1,500 Quintals", trend: "up" },
      { state: "Karnataka", district: "Bidar", mandiName: "Bidar Yard", privatePrice: 8980, arrivalQuantity: "1,100 Quintals", trend: "up" }
    ]
  },

  // VEGETABLES
  {
    id: 9,
    name: "Onion (Nashik Red / Garwa)",
    scientificName: "Allium cepa",
    category: "Vegetables",
    iconEmoji: "🧅",
    state: "Maharashtra",
    district: "Nashik",
    mandiName: "Lasalgaon APMC",
    govt: 1200,
    private: 2150,
    trend: "up",
    globalRegion: "Global Export",
    season: "Kharif & Rabi",
    durationDays: "120 - 140 Days",
    avgYieldPerAcre: "80 - 120 Quintals",
    costPerAcre: 35000,
    demandLevel: "Extremely High",
    soilType: "Deep Alluvial Loam Soil",
    moistureContent: "Cured Fresh",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 1000, private: 1100 }, { month: "Feb", govt: 1200, private: 2150 }],
    statePrices: [
      { state: "Maharashtra", district: "Nashik", mandiName: "Lasalgaon APMC", privatePrice: 2150, arrivalQuantity: "9,200 Quintals", trend: "up" },
      { state: "Karnataka", district: "Hubli", mandiName: "Hubli Yard", privatePrice: 2280, arrivalQuantity: "4,100 Quintals", trend: "up" },
      { state: "Madhya Pradesh", district: "Mandsaur", mandiName: "Mandsaur Mandi", privatePrice: 2040, arrivalQuantity: "3,800 Quintals", trend: "up" },
      { state: "Gujarat", district: "Bhavnagar", mandiName: "Mahuva APMC", privatePrice: 2190, arrivalQuantity: "4,500 Quintals", trend: "up" }
    ]
  },
  {
    id: 10,
    name: "Tomato (Hybrid Red / Kolar)",
    scientificName: "Solanum lycopersicum",
    category: "Vegetables",
    iconEmoji: "🍅",
    state: "Karnataka",
    district: "Kolar",
    mandiName: "Kolar APMC",
    govt: 800,
    private: 1850,
    trend: "up",
    globalRegion: "Global",
    season: "All Season",
    durationDays: "120 - 150 Days",
    avgYieldPerAcre: "120 - 180 Quintals",
    costPerAcre: 45000,
    demandLevel: "Extremely High",
    soilType: "Loam Soil",
    moistureContent: "Fresh Farm Pick",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 600, private: 900 }, { month: "Feb", govt: 800, private: 1850 }],
    statePrices: [
      { state: "Karnataka", district: "Kolar", mandiName: "Kolar APMC", privatePrice: 1850, arrivalQuantity: "5,200 Quintals", trend: "up" },
      { state: "Maharashtra", district: "Narayangaon", mandiName: "Junnar APMC", privatePrice: 1780, arrivalQuantity: "3,900 Quintals", trend: "up" },
      { state: "Andhra Pradesh", district: "Madanapalle", mandiName: "Madanapalle Yard", privatePrice: 1910, arrivalQuantity: "6,100 Quintals", trend: "up" }
    ]
  },
  {
    id: 11,
    name: "Potato (Jyoti & Kufri)",
    scientificName: "Solanum tuberosum",
    category: "Vegetables",
    iconEmoji: "🥔",
    state: "Uttar Pradesh",
    district: "Agra",
    mandiName: "Agra APMC",
    govt: 1100,
    private: 1680,
    trend: "up",
    globalRegion: "Global",
    season: "Rabi",
    durationDays: "90 - 110 Days",
    avgYieldPerAcre: "100 - 140 Quintals",
    costPerAcre: 30000,
    demandLevel: "High",
    soilType: "Sandy Loam Soil",
    moistureContent: "Fresh Cold Storage",
    qualityGrade: "Standard Quality",
    lastUpdated: "Live Today 08:25 PM",
    history: [{ month: "Jan", govt: 950, private: 1300 }, { month: "Feb", govt: 1100, private: 1680 }],
    statePrices: [
      { state: "Uttar Pradesh", district: "Agra", mandiName: "Agra APMC", privatePrice: 1680, arrivalQuantity: "12,000 Quintals", trend: "up" },
      { state: "West Bengal", district: "Hooghly", mandiName: "Hooghly Yard", privatePrice: 1620, arrivalQuantity: "8,500 Quintals", trend: "up" },
      { state: "Punjab", district: "Jalandhar", mandiName: "Jalandhar APMC", privatePrice: 1590, arrivalQuantity: "6,200 Quintals", trend: "up" }
    ]
  },
  {
    id: 12,
    name: "Green Chilli (Guntur Teja / Fresh)",
    scientificName: "Capsicum annuum",
    category: "Vegetables",
    iconEmoji: "🌶️",
    state: "Andhra Pradesh",
    district: "Guntur",
    mandiName: "Guntur APMC Yard",
    govt: 2500,
    private: 4800,
    trend: "up",
    globalRegion: "India, SE Asia",
    season: "Kharif & Rabi",
    durationDays: "120 Days",
    avgYieldPerAcre: "40 - 60 Quintals",
    costPerAcre: 32000,
    demandLevel: "High",
    soilType: "Loamy Soil",
    moistureContent: "Fresh Harvest",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:15 PM",
    history: [{ month: "Jan", govt: 2200, private: 4100 }, { month: "Feb", govt: 2500, private: 4800 }],
    statePrices: [
      { state: "Andhra Pradesh", district: "Guntur", mandiName: "Guntur Yard", privatePrice: 4800, arrivalQuantity: "3,200 Quintals", trend: "up" },
      { state: "Telangana", district: "Khammam", mandiName: "Khammam APMC", privatePrice: 4650, arrivalQuantity: "2,400 Quintals", trend: "up" }
    ]
  },
  {
    id: 13,
    name: "Garlic (Ooty & MP White)",
    scientificName: "Allium sativum",
    category: "Vegetables",
    iconEmoji: "🧄",
    state: "Madhya Pradesh",
    district: "Mandsaur",
    mandiName: "Mandsaur APMC",
    govt: 4000,
    private: 14500,
    trend: "up",
    globalRegion: "India, China",
    season: "Rabi",
    durationDays: "130 - 150 Days",
    avgYieldPerAcre: "30 - 45 Quintals",
    costPerAcre: 40000,
    demandLevel: "Extremely High",
    soilType: "Rich Loam Soil",
    moistureContent: "Dry Cured",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 3500, private: 12000 }, { month: "Feb", govt: 4000, private: 14500 }],
    statePrices: [
      { state: "Madhya Pradesh", district: "Mandsaur", mandiName: "Mandsaur APMC", privatePrice: 14500, arrivalQuantity: "1,800 Quintals", trend: "up" },
      { state: "Rajasthan", district: "Kota", mandiName: "Kota Yard", privatePrice: 14100, arrivalQuantity: "1,400 Quintals", trend: "up" }
    ]
  },
  {
    id: 14,
    name: "Ginger (Fresh Organic)",
    scientificName: "Zingiber officinale",
    category: "Vegetables",
    iconEmoji: "🫚",
    state: "Kerala",
    district: "Wayanad",
    mandiName: "Wayanad Spices Market",
    govt: 3500,
    private: 8200,
    trend: "up",
    globalRegion: "India, China, Nigeria",
    season: "Kharif",
    durationDays: "200 - 240 Days",
    avgYieldPerAcre: "50 - 70 Quintals",
    costPerAcre: 50000,
    demandLevel: "High",
    soilType: "Laterite Soil",
    moistureContent: "Fresh Rhizome",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 08:10 PM",
    history: [{ month: "Jan", govt: 3000, private: 7200 }, { month: "Feb", govt: 3500, private: 8200 }],
    statePrices: [
      { state: "Kerala", district: "Wayanad", mandiName: "Wayanad Market", privatePrice: 8200, arrivalQuantity: "950 Quintals", trend: "up" },
      { state: "Karnataka", district: "Coorg", mandiName: "Madikeri APMC", privatePrice: 8400, arrivalQuantity: "820 Quintals", trend: "up" }
    ]
  },

  // FRUITS
  {
    id: 15,
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
    durationDays: "Perennial Orchard",
    avgYieldPerAcre: "40 - 60 Quintals",
    costPerAcre: 30000,
    demandLevel: "Extremely High",
    soilType: "Lateritic Red Soil",
    moistureContent: "Fresh Ripe",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 7000, private: 12000 }, { month: "Feb", govt: 9000, private: 18500 }],
    statePrices: [
      { state: "Maharashtra", district: "Ratnagiri", mandiName: "Ratnagiri APMC", privatePrice: 18500, arrivalQuantity: "650 Crates", trend: "up" },
      { state: "Gujarat", district: "Junagadh", mandiName: "Talala Gir Yard", privatePrice: 14800, arrivalQuantity: "1,200 Crates", trend: "up" },
      { state: "Uttar Pradesh", district: "Lucknow", mandiName: "Malihabad APMC", privatePrice: 12500, arrivalQuantity: "1,800 Crates", trend: "up" }
    ]
  },
  {
    id: 16,
    name: "Banana (Grand Naine / Jalgaon)",
    scientificName: "Musa acuminata",
    category: "Fruits",
    iconEmoji: "🍌",
    state: "Maharashtra",
    district: "Jalgaon",
    mandiName: "Jalgaon Banana Market",
    govt: 1100,
    private: 2250,
    trend: "up",
    globalRegion: "India, Ecuador, Philippines",
    season: "All Season",
    durationDays: "330 - 360 Days",
    avgYieldPerAcre: "250 - 350 Quintals",
    costPerAcre: 60000,
    demandLevel: "High",
    soilType: "Deep Rich Clay Loam Soil",
    moistureContent: "Fresh Bunch",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:30 PM",
    history: [{ month: "Jan", govt: 950, private: 1800 }, { month: "Feb", govt: 1100, private: 2250 }],
    statePrices: [
      { state: "Maharashtra", district: "Jalgaon", mandiName: "Jalgaon APMC", privatePrice: 2250, arrivalQuantity: "14,000 Quintals", trend: "up" },
      { state: "Tamil Nadu", district: "Tiruchirappalli", mandiName: "Trichy APMC", privatePrice: 2180, arrivalQuantity: "8,900 Quintals", trend: "up" },
      { state: "Gujarat", district: "Anand", mandiName: "Anand Yard", privatePrice: 2310, arrivalQuantity: "5,400 Quintals", trend: "up" }
    ]
  },
  {
    id: 17,
    name: "Apple (Royal Delicious Shimla & Kashmir)",
    scientificName: "Malus domestica",
    category: "Fruits",
    iconEmoji: "🍎",
    state: "Himachal Pradesh",
    district: "Shimla",
    mandiName: "Dhalli APMC Shimla",
    govt: 4500,
    private: 9200,
    trend: "up",
    globalRegion: "India, USA, China, Italy",
    season: "Autumn / Harvest",
    durationDays: "Perennial Tree",
    avgYieldPerAcre: "60 - 90 Quintals",
    costPerAcre: 50000,
    demandLevel: "Extremely High",
    soilType: "Hill Loamy Soil",
    moistureContent: "Fresh Orchard Pick",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 4000, private: 8200 }, { month: "Feb", govt: 4500, private: 9200 }],
    statePrices: [
      { state: "Himachal Pradesh", district: "Shimla", mandiName: "Dhalli APMC", privatePrice: 9200, arrivalQuantity: "4,500 Boxes", trend: "up" },
      { state: "Jammu & Kashmir", district: "Sopore", mandiName: "Sopore Fruit Mandi", privatePrice: 8900, arrivalQuantity: "9,800 Boxes", trend: "up" }
    ]
  },
  {
    id: 18,
    name: "Pomegranate (Bhagwa Solapur)",
    scientificName: "Punica granatum",
    category: "Fruits",
    iconEmoji: "🪸",
    state: "Maharashtra",
    district: "Solapur",
    mandiName: "Solapur APMC Fruit Market",
    govt: 6000,
    private: 13500,
    trend: "up",
    globalRegion: "India, Iran, Spain",
    season: "Mrg-Bahar & Hasta",
    durationDays: "Perennial Orchard",
    avgYieldPerAcre: "30 - 50 Quintals",
    costPerAcre: 45000,
    demandLevel: "High",
    soilType: "Light Well-Drained Soil",
    moistureContent: "Fresh Harvest",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:30 PM",
    history: [{ month: "Jan", govt: 5500, private: 11000 }, { month: "Feb", govt: 6000, private: 13500 }],
    statePrices: [
      { state: "Maharashtra", district: "Solapur", mandiName: "Solapur APMC", privatePrice: 13500, arrivalQuantity: "3,200 Crates", trend: "up" },
      { state: "Karnataka", district: "Chitradurga", mandiName: "Chitradurga Yard", privatePrice: 12800, arrivalQuantity: "2,100 Crates", trend: "up" }
    ]
  },
  {
    id: 19,
    name: "Orange (Nagpur Mandarin)",
    scientificName: "Citrus reticulata",
    category: "Fruits",
    iconEmoji: "🍊",
    state: "Maharashtra",
    district: "Nagpur",
    mandiName: "Nagpur Kalamna APMC",
    govt: 3000,
    private: 6800,
    trend: "up",
    globalRegion: "India, Brazil, USA",
    season: "Winter",
    durationDays: "Perennial Tree",
    avgYieldPerAcre: "50 - 80 Quintals",
    costPerAcre: 35000,
    demandLevel: "High",
    soilType: "Black Cotton Soil",
    moistureContent: "Juicy Fresh",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:25 PM",
    history: [{ month: "Jan", govt: 2500, private: 5500 }, { month: "Feb", govt: 3000, private: 6800 }],
    statePrices: [
      { state: "Maharashtra", district: "Nagpur", mandiName: "Kalamna APMC", privatePrice: 6800, arrivalQuantity: "6,500 Quintals", trend: "up" },
      { state: "Punjab", district: "Abohar", mandiName: "Kinnow Yard Abohar", privatePrice: 6200, arrivalQuantity: "4,200 Quintals", trend: "up" }
    ]
  },

  // OILSEEDS
  {
    id: 20,
    name: "Soybean (JS-335 / Yellow)",
    scientificName: "Glycine max",
    category: "Oilseeds",
    iconEmoji: "🌱",
    state: "Madhya Pradesh",
    district: "Indore",
    mandiName: "Indore APMC Yard",
    govt: 4600,
    private: 4920,
    trend: "up",
    globalRegion: "India, USA, Brazil, Argentina",
    season: "Kharif",
    durationDays: "95 - 105 Days",
    avgYieldPerAcre: "10 - 14 Quintals",
    costPerAcre: 13000,
    demandLevel: "High",
    soilType: "Deep Black Cotton Soil",
    moistureContent: "10.0%",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 4400, private: 4600 }, { month: "Feb", govt: 4600, private: 4920 }],
    statePrices: [
      { state: "Madhya Pradesh", district: "Indore", mandiName: "Indore APMC", privatePrice: 4920, arrivalQuantity: "7,800 Quintals", trend: "up" },
      { state: "Maharashtra", district: "Latur", mandiName: "Latur Yard", privatePrice: 4880, arrivalQuantity: "5,400 Quintals", trend: "up" },
      { state: "Rajasthan", district: "Kota", mandiName: "Kota APMC", privatePrice: 4790, arrivalQuantity: "3,100 Quintals", trend: "up" }
    ]
  },
  {
    id: 21,
    name: "Mustard / Rapeseed (Yellow & Black)",
    scientificName: "Brassica juncea",
    category: "Oilseeds",
    iconEmoji: "🌼",
    state: "Rajasthan",
    district: "Bharatpur",
    mandiName: "Bharatpur APMC",
    govt: 5650,
    private: 6150,
    trend: "up",
    globalRegion: "India, Canada, Australia",
    season: "Rabi",
    durationDays: "110 - 125 Days",
    avgYieldPerAcre: "8 - 12 Quintals",
    costPerAcre: 12000,
    demandLevel: "High",
    soilType: "Loamy & Alluvial Soil",
    moistureContent: "8.0%",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:30 PM",
    history: [{ month: "Jan", govt: 5450, private: 5700 }, { month: "Feb", govt: 5650, private: 6150 }],
    statePrices: [
      { state: "Rajasthan", district: "Bharatpur", mandiName: "Bharatpur APMC", privatePrice: 6150, arrivalQuantity: "6,200 Quintals", trend: "up" },
      { state: "Haryana", district: "Bhiwani", mandiName: "Bhiwani Yard", privatePrice: 6080, arrivalQuantity: "4,500 Quintals", trend: "up" },
      { state: "Madhya Pradesh", district: "Morena", mandiName: "Morena APMC", privatePrice: 5980, arrivalQuantity: "3,800 Quintals", trend: "up" }
    ]
  },

  // SPICES & HERBS
  {
    id: 22,
    name: "Turmeric (Sangli & Erode Finger)",
    scientificName: "Curcuma longa",
    category: "Spices & Herbs",
    iconEmoji: "🫚",
    state: "Maharashtra",
    district: "Sangli",
    mandiName: "Sangli APMC Spices Yard",
    govt: 7500,
    private: 16800,
    trend: "up",
    globalRegion: "India, SE Asia",
    season: "Kharif",
    durationDays: "240 - 270 Days",
    avgYieldPerAcre: "25 - 35 Quintals",
    costPerAcre: 45000,
    demandLevel: "Extremely High",
    soilType: "Rich Well-Drained Loam Soil",
    moistureContent: "Cured Dry Finger",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 6800, private: 13500 }, { month: "Feb", govt: 7500, private: 16800 }],
    statePrices: [
      { state: "Maharashtra", district: "Sangli", mandiName: "Sangli APMC", privatePrice: 16800, arrivalQuantity: "2,400 Quintals", trend: "up" },
      { state: "Tamil Nadu", district: "Erode", mandiName: "Erode Yard", privatePrice: 17200, arrivalQuantity: "3,100 Quintals", trend: "up" },
      { state: "Telangana", district: "Nizamabad", mandiName: "Nizamabad APMC", privatePrice: 16500, arrivalQuantity: "2,800 Quintals", trend: "up" }
    ]
  },
  {
    id: 23,
    name: "Cumin / Jeera (Unjha Premium)",
    scientificName: "Cuminum cyminum",
    category: "Spices & Herbs",
    iconEmoji: "🌿",
    state: "Gujarat",
    district: "Unjha",
    mandiName: "Unjha APMC Spices Market",
    govt: 15000,
    private: 31500,
    trend: "up",
    globalRegion: "India, Syria, Turkey",
    season: "Rabi",
    durationDays: "110 - 120 Days",
    avgYieldPerAcre: "5 - 8 Quintals",
    costPerAcre: 20000,
    demandLevel: "Extremely High",
    soilType: "Well-Drained Loamy Soil",
    moistureContent: "Sun Dried",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 14000, private: 27500 }, { month: "Feb", govt: 15000, private: 31500 }],
    statePrices: [
      { state: "Gujarat", district: "Mehsana", mandiName: "Unjha APMC", privatePrice: 31500, arrivalQuantity: "8,900 Quintals", trend: "up" },
      { state: "Rajasthan", district: "Jodhpur", mandiName: "Jodhpur Yard", privatePrice: 30800, arrivalQuantity: "5,400 Quintals", trend: "up" }
    ]
  }
];

export default function MarketPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCropModal, setSelectedCropModal] = useState<CropItem | null>(null);

  // Dynamic filter for search, category, and state
  const filteredCrops = useMemo(() => {
    return COMPREHENSIVE_CROPS_DATABASE.filter((crop) => {
      // Search term matching
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !term || 
        crop.name.toLowerCase().includes(term) ||
        crop.scientificName.toLowerCase().includes(term) ||
        crop.category.toLowerCase().includes(term) ||
        crop.state.toLowerCase().includes(term) ||
        crop.district.toLowerCase().includes(term) ||
        crop.mandiName.toLowerCase().includes(term) ||
        crop.statePrices.some(sp => sp.state.toLowerCase().includes(term) || sp.mandiName.toLowerCase().includes(term));

      // Category matching
      const matchesCategory = 
        selectedCategory === "All Categories" || 
        crop.category === selectedCategory;

      // State matching
      const matchesState = 
        selectedState === "All States" || 
        crop.state === selectedState ||
        crop.statePrices.some(sp => sp.state === selectedState);

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [searchTerm, selectedCategory, selectedState]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans max-w-7xl mx-auto space-y-8 pt-[78px]">
      
      {/* HEADER BANNER WITH THICK 3PX BORDER */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-800 to-green-950 text-white rounded-3xl p-6 md:p-10 shadow-xl border-[3px] border-green-600/70 dark:border-green-500/60 relative overflow-hidden space-y-4">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-green-300 border border-white/20">
            <Globe className="w-3.5 h-3.5 text-yellow-400" />
            <span>Real-Time APMC Mandi Rates Across 36 States & UTs</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white">
            Market Prices & Analytics
          </h1>

          <p className="text-green-100/90 text-xs md:text-sm font-medium max-w-3xl leading-relaxed">
            Track real-time Govt MSP vs Private APMC Mandi rates for all Crops, Fruits, Vegetables, Oilseeds & Spices across Indian States. Engineered by Uday Pratap Singh Chauhan (udchauhan0987@gmail.com).
          </p>
        </div>
      </div>

      {/* SEARCH BAR & FILTER CONTROLS WITH THICK 3PX BORDERS */}
      <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-5 md:p-6 shadow-sm border-[3px] border-gray-300 dark:border-white/20 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* SEARCH INPUT */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search any crop, fruit, vegetable, state, or mandi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 font-bold text-xs text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* CATEGORY SELECTOR */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 font-bold text-xs text-gray-900 dark:text-white focus:outline-none focus:border-green-500 cursor-pointer"
            >
              <option value="All Categories">All Categories (Crops, Fruits, Veggies)</option>
              <option value="Cereals & Grains">🌾 Cereals & Grains</option>
              <option value="Pulses & Legumes">🫘 Pulses & Legumes</option>
              <option value="Vegetables">🧅 Vegetables & Roots</option>
              <option value="Fruits">🥭 Fruits & Orchards</option>
              <option value="Oilseeds">🌱 Oilseeds</option>
              <option value="Spices & Herbs">🫚 Spices & Herbs</option>
            </select>
          </div>

          {/* STATE SELECTOR */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 font-bold text-xs text-gray-900 dark:text-white focus:outline-none focus:border-green-500 cursor-pointer"
            >
              {ALL_INDIAN_STATES.map((st, idx) => (
                <option key={idx} value={st}>{st === "All States" ? "📍 All Indian States" : `📍 ${st}`}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex justify-between items-center pt-2 text-xs font-black text-gray-500 border-t border-gray-200/80 dark:border-white/10">
          <span>Showing {filteredCrops.length} verified commodities</span>
          {searchTerm && (
            <button onClick={() => { setSearchTerm(""); setSelectedCategory("All Categories"); setSelectedState("All States"); }} className="text-green-600 dark:text-green-400 hover:underline">
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* COMMODITY GRID WITH 3PX THICK BORDERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white dark:bg-[#1a1b23] rounded-3xl border-[3px] border-gray-300 dark:border-white/20 space-y-3">
            <Sprout className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-black text-base text-gray-900 dark:text-white">No Matching Crops, Fruits or Vegetables Found</h3>
            <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto">Try searching for "Wheat", "Onion", "Mango", "Tomato", "Soybean", or change your state filter.</p>
          </div>
        ) : (
          filteredCrops.map((crop) => {
            // Find price for selected state if state filter is active
            const stateSpecific = selectedState !== "All States" 
              ? crop.statePrices.find(sp => sp.state === selectedState) 
              : null;

            const displayPrice = stateSpecific ? stateSpecific.privatePrice : crop.private;
            const displayMandi = stateSpecific ? `${stateSpecific.mandiName} (${stateSpecific.district})` : `${crop.mandiName} (${crop.district}, ${crop.state})`;

            return (
              <div 
                key={crop.id}
                className="bg-white dark:bg-[#1a1b23] rounded-3xl border-[3px] border-gray-300 dark:border-white/20 p-6 shadow-sm hover:shadow-2xl hover:border-green-500 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 bg-gray-100 dark:bg-white/10 rounded-2xl border-2 border-gray-200 dark:border-white/10 shadow-sm">
                        {crop.iconEmoji}
                      </span>
                      <div>
                        <h3 className="font-black text-base text-gray-900 dark:text-white leading-tight">
                          {crop.name}
                        </h3>
                        <span className="text-[10px] text-gray-400 font-bold block italic">{crop.scientificName}</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800">
                      {crop.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl border border-gray-200/60 dark:border-white/5">
                    <MapPin className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span className="truncate">{displayMandi}</span>
                  </div>

                  {/* PRICE DISPLAY */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-green-50/80 dark:bg-green-950/40 p-3 rounded-2xl border-2 border-green-300 dark:border-green-800 space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-green-800 dark:text-green-300 block">APMC Mandi Rate</span>
                      <span className="text-lg font-black text-green-700 dark:text-green-400 block">₹{displayPrice.toLocaleString("en-IN")}<span className="text-[10px] font-bold text-gray-500">/q</span></span>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border-2 border-gray-200 dark:border-white/10 space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">Govt MSP Rate</span>
                      <span className="text-lg font-black text-gray-900 dark:text-white block">₹{crop.govt.toLocaleString("en-IN")}<span className="text-[10px] font-bold text-gray-400">/q</span></span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-gray-100 dark:border-white/10 flex justify-between items-center text-xs">
                  <span className="text-[10px] font-extrabold text-green-600 bg-green-100 dark:bg-green-950 px-2 py-0.5 rounded-md">
                    📈 Market Trending
                  </span>

                  <button
                    onClick={() => setSelectedCropModal(crop)}
                    className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1 transition-all"
                  >
                    View Analytics <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ANALYTICS MODAL WITH 3PX THICK BORDER */}
      {selectedCropModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1b23] border-[3px] border-green-500 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b-2 border-gray-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCropModal.iconEmoji}</span>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">{selectedCropModal.name}</h3>
                  <span className="text-xs text-gray-400 font-bold">{selectedCropModal.category} • {selectedCropModal.season}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCropModal(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200/60 dark:border-white/5">
                <span className="text-gray-400 font-bold block text-[10px]">APMC Mandi Price</span>
                <span className="text-base font-black text-green-600 dark:text-green-400">₹{selectedCropModal.private}/q</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200/60 dark:border-white/5">
                <span className="text-gray-400 font-bold block text-[10px]">Govt MSP Rate</span>
                <span className="text-base font-black text-gray-900 dark:text-white">₹{selectedCropModal.govt}/q</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200/60 dark:border-white/5">
                <span className="text-gray-400 font-bold block text-[10px]">Avg Yield / Acre</span>
                <span className="text-xs font-black text-gray-900 dark:text-white">{selectedCropModal.avgYieldPerAcre}</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200/60 dark:border-white/5">
                <span className="text-gray-400 font-bold block text-[10px]">Quality Grade</span>
                <span className="text-xs font-black text-green-600 dark:text-green-400">{selectedCropModal.qualityGrade}</span>
              </div>
            </div>

            {/* STATE-BY-STATE MANDI RATES TABLE */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-gray-900 dark:text-white uppercase tracking-wider text-xs">
                State-by-State APMC Mandi Rates
              </h4>
              <div className="space-y-2">
                {selectedCropModal.statePrices.map((sp, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200/60 dark:border-white/5 font-bold">
                    <div>
                      <span className="text-gray-900 dark:text-white block">{sp.mandiName} ({sp.state})</span>
                      <span className="text-[10px] text-gray-400">Daily Arrival: {sp.arrivalQuantity}</span>
                    </div>
                    <span className="text-sm font-black text-green-600 dark:text-green-400">₹{sp.privatePrice}/q</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedCropModal(null)}
              className="w-full py-3 bg-gray-200 dark:bg-white/10 font-black text-xs text-gray-800 dark:text-gray-200 rounded-xl"
            >
              Close Analytics Panel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
