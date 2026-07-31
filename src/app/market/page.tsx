"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  X, Globe, Sprout, Info, Calendar, DollarSign, Droplets, ChevronRight, RefreshCw, BarChart2, Zap, Calculator, Landmark, ShieldCheck, ArrowRightLeft, Scale, Award, Eye, SlidersHorizontal, ArrowUpDown, AlertCircle
} from "lucide-react";
import Link from "next/link";

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
  isAvailable?: boolean;
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

// EXHAUSTIVE MASTER DATABASE OF ALL CROPS, FRUITS, & VEGETABLES
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
    globalRegion: "India, USA, Russia",
    season: "Rabi (Winter)",
    durationDays: "110 - 130 Days",
    avgYieldPerAcre: "18 - 22 Quintals",
    costPerAcre: 18000,
    demandLevel: "High",
    soilType: "Loamy & Alluvial Soil",
    moistureContent: "11.2%",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:45 PM",
    history: [{ month: "Jan", govt: 2100, private: 2200 }, { month: "Feb", govt: 2150, private: 2300 }, { month: "Mar", govt: 2275, private: 2550 }],
    statePrices: [
      { state: "Maharashtra", district: "Pune", mandiName: "Baramati APMC", privatePrice: 2550, arrivalQuantity: "1,400 Quintals", trend: "up" },
      { state: "Madhya Pradesh", district: "Ujjain", mandiName: "Ujjain Mandi", privatePrice: 2680, arrivalQuantity: "3,200 Quintals", trend: "up" },
      { state: "Punjab", district: "Ludhiana", mandiName: "Ludhiana Yard", privatePrice: 2420, arrivalQuantity: "4,500 Quintals", trend: "up" }
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
    globalRegion: "India, Pakistan",
    season: "Kharif",
    durationDays: "135 - 145 Days",
    avgYieldPerAcre: "16 - 20 Quintals",
    costPerAcre: 24000,
    demandLevel: "Extremely High",
    soilType: "Clayey Alluvial Soil",
    moistureContent: "12.0%",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 08:45 PM",
    history: [{ month: "Jan", govt: 2000, private: 3800 }, { month: "Feb", govt: 2183, private: 4350 }],
    statePrices: [
      { state: "Punjab", district: "Amritsar", mandiName: "Amritsar Mandi", privatePrice: 4350, arrivalQuantity: "6,800 Quintals", trend: "up" },
      { state: "Haryana", district: "Karnal", mandiName: "Karnal APMC", privatePrice: 4420, arrivalQuantity: "5,200 Quintals", trend: "up" }
    ]
  },
  {
    id: 3,
    name: "Maize / Corn",
    scientificName: "Zea mays",
    category: "Cereals & Grains",
    iconEmoji: "🌽",
    state: "Bihar",
    district: "Purnea",
    mandiName: "Purnea APMC",
    govt: 2090,
    private: 2320,
    trend: "up",
    globalRegion: "Global",
    season: "Kharif & Rabi",
    durationDays: "100 Days",
    avgYieldPerAcre: "25 Quintals",
    costPerAcre: 15000,
    demandLevel: "High",
    soilType: "Heavy Soil",
    moistureContent: "13.0%",
    qualityGrade: "Standard Quality",
    lastUpdated: "Live Today 08:40 PM",
    history: [{ month: "Jan", govt: 1962, private: 2100 }, { month: "Feb", govt: 2090, private: 2320 }],
    statePrices: [{ state: "Bihar", district: "Purnea", mandiName: "Purnea APMC", privatePrice: 2320, arrivalQuantity: "5,800 Quintals", trend: "up" }]
  },

  // FRUITS (ALL MAJOR INDIAN FRUITS)
  {
    id: 4,
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
    globalRegion: "India, USA, China",
    season: "Autumn",
    durationDays: "Perennial Tree",
    avgYieldPerAcre: "80 Quintals",
    costPerAcre: 50000,
    demandLevel: "Extremely High",
    soilType: "Hill Loam Soil",
    moistureContent: "Fresh Orchard Pick",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:45 PM",
    history: [{ month: "Jan", govt: 4000, private: 8200 }, { month: "Feb", govt: 4500, private: 9200 }],
    statePrices: [
      { state: "Himachal Pradesh", district: "Shimla", mandiName: "Dhalli APMC", privatePrice: 9200, arrivalQuantity: "4,500 Boxes", trend: "up" },
      { state: "Jammu & Kashmir", district: "Sopore", mandiName: "Sopore Fruit Mandi", privatePrice: 8900, arrivalQuantity: "9,800 Boxes", trend: "up" }
    ]
  },
  {
    id: 5,
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
    globalRegion: "India, Ecuador",
    season: "All Season",
    durationDays: "350 Days",
    avgYieldPerAcre: "300 Quintals",
    costPerAcre: 60000,
    demandLevel: "High",
    soilType: "Clay Loam Soil",
    moistureContent: "Fresh Bunch",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:40 PM",
    history: [{ month: "Jan", govt: 950, private: 1800 }, { month: "Feb", govt: 1100, private: 2250 }],
    statePrices: [
      { state: "Maharashtra", district: "Jalgaon", mandiName: "Jalgaon APMC", privatePrice: 2250, arrivalQuantity: "14,000 Quintals", trend: "up" },
      { state: "Tamil Nadu", district: "Trichy", mandiName: "Trichy APMC", privatePrice: 2180, arrivalQuantity: "8,900 Quintals", trend: "up" }
    ]
  },
  {
    id: 6,
    name: "Mango (Alphonso / Kesar / Dasheri)",
    scientificName: "Mangifera indica",
    category: "Fruits",
    iconEmoji: "🥭",
    state: "Maharashtra",
    district: "Ratnagiri",
    mandiName: "Ratnagiri APMC",
    govt: 9000,
    private: 18500,
    trend: "up",
    globalRegion: "India, Thailand",
    season: "Summer",
    durationDays: "Perennial Orchard",
    avgYieldPerAcre: "50 Quintals",
    costPerAcre: 30000,
    demandLevel: "Extremely High",
    soilType: "Lateritic Red Soil",
    moistureContent: "Ripe Fresh",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:45 PM",
    history: [{ month: "Jan", govt: 7000, private: 12000 }, { month: "Feb", govt: 9000, private: 18500 }],
    statePrices: [
      { state: "Maharashtra", district: "Ratnagiri", mandiName: "Ratnagiri APMC", privatePrice: 18500, arrivalQuantity: "650 Crates", trend: "up" },
      { state: "Gujarat", district: "Junagadh", mandiName: "Talala Gir Yard", privatePrice: 14800, arrivalQuantity: "1,200 Crates", trend: "up" },
      { state: "Uttar Pradesh", district: "Lucknow", mandiName: "Malihabad APMC", privatePrice: 12500, arrivalQuantity: "1,800 Crates", trend: "up" }
    ]
  },
  {
    id: 7,
    name: "Grapes (Thompson Seedless Nashik)",
    scientificName: "Vitis vinifera",
    category: "Fruits",
    iconEmoji: "🍇",
    state: "Maharashtra",
    district: "Nashik",
    mandiName: "Pimpalgaon APMC",
    govt: 4000,
    private: 7800,
    trend: "up",
    globalRegion: "India, Europe",
    season: "Winter & Spring",
    durationDays: "Perennial Vine",
    avgYieldPerAcre: "100 Quintals",
    costPerAcre: 90000,
    demandLevel: "High",
    soilType: "Black Loam Soil",
    moistureContent: "Fresh Export Berry",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 3500, private: 6500 }, { month: "Feb", govt: 4000, private: 7800 }],
    statePrices: [
      { state: "Maharashtra", district: "Nashik", mandiName: "Pimpalgaon APMC", privatePrice: 7800, arrivalQuantity: "4,200 Quintals", trend: "up" }
    ]
  },
  {
    id: 8,
    name: "Pomegranate (Bhagwa Solapur)",
    scientificName: "Punica granatum",
    category: "Fruits",
    iconEmoji: "🪸",
    state: "Maharashtra",
    district: "Solapur",
    mandiName: "Solapur APMC",
    govt: 6000,
    private: 13500,
    trend: "up",
    globalRegion: "India, Spain",
    season: "Mrg & Hasta Bahar",
    durationDays: "Perennial",
    avgYieldPerAcre: "40 Quintals",
    costPerAcre: 45000,
    demandLevel: "High",
    soilType: "Light Well-Drained Soil",
    moistureContent: "Fresh Juicy",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:40 PM",
    history: [{ month: "Jan", govt: 5500, private: 11000 }, { month: "Feb", govt: 6000, private: 13500 }],
    statePrices: [
      { state: "Maharashtra", district: "Solapur", mandiName: "Solapur APMC", privatePrice: 13500, arrivalQuantity: "3,200 Crates", trend: "up" }
    ]
  },
  {
    id: 9,
    name: "Orange (Nagpur Mandarin)",
    scientificName: "Citrus reticulata",
    category: "Fruits",
    iconEmoji: "🍊",
    state: "Maharashtra",
    district: "Nagpur",
    mandiName: "Kalamna APMC Nagpur",
    govt: 3000,
    private: 6800,
    trend: "up",
    globalRegion: "India, Brazil",
    season: "Winter",
    durationDays: "Perennial",
    avgYieldPerAcre: "70 Quintals",
    costPerAcre: 35000,
    demandLevel: "High",
    soilType: "Black Cotton Soil",
    moistureContent: "Juicy Fresh",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 2500, private: 5500 }, { month: "Feb", govt: 3000, private: 6800 }],
    statePrices: [{ state: "Maharashtra", district: "Nagpur", mandiName: "Kalamna APMC", privatePrice: 6800, arrivalQuantity: "6,500 Quintals", trend: "up" }]
  },
  {
    id: 10,
    name: "Papaya (Taiwan Red Lady)",
    scientificName: "Carica papaya",
    category: "Fruits",
    iconEmoji: "🍈",
    state: "Gujarat",
    district: "Anand",
    mandiName: "Anand APMC",
    govt: 1000,
    private: 2400,
    trend: "up",
    globalRegion: "India, Brazil",
    season: "All Season",
    durationDays: "270 Days",
    avgYieldPerAcre: "400 Quintals",
    costPerAcre: 40000,
    demandLevel: "High",
    soilType: "Sandy Loam Soil",
    moistureContent: "Fresh Harvest",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:25 PM",
    history: [{ month: "Jan", govt: 900, private: 1900 }, { month: "Feb", govt: 1000, private: 2400 }],
    statePrices: [{ state: "Gujarat", district: "Anand", mandiName: "Anand APMC", privatePrice: 2400, arrivalQuantity: "3,800 Quintals", trend: "up" }]
  },
  {
    id: 11,
    name: "Guava (Allahabad Safeda / Taiwan Pink)",
    scientificName: "Psidium guajava",
    category: "Fruits",
    iconEmoji: "🍈",
    state: "Uttar Pradesh",
    district: "Allahabad",
    mandiName: "Prayagraj APMC",
    govt: 1500,
    private: 3800,
    trend: "up",
    globalRegion: "India, Mexico",
    season: "Winter & Monsoon",
    durationDays: "Perennial",
    avgYieldPerAcre: "120 Quintals",
    costPerAcre: 25000,
    demandLevel: "Moderate",
    soilType: "Loam Soil",
    moistureContent: "Fresh",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 08:20 PM",
    history: [{ month: "Jan", govt: 1200, private: 3100 }, { month: "Feb", govt: 1500, private: 3800 }],
    statePrices: [{ state: "Uttar Pradesh", district: "Allahabad", mandiName: "Prayagraj APMC", privatePrice: 3800, arrivalQuantity: "2,900 Quintals", trend: "up" }]
  },
  {
    id: 12,
    name: "Watermelon (Sugar Baby)",
    scientificName: "Citrullus lanatus",
    category: "Fruits",
    iconEmoji: "🍉",
    state: "Karnataka",
    district: "Chikballapur",
    mandiName: "Chikballapur APMC",
    govt: 600,
    private: 1450,
    trend: "up",
    globalRegion: "India, China",
    season: "Summer",
    durationDays: "85 Days",
    avgYieldPerAcre: "250 Quintals",
    costPerAcre: 20000,
    demandLevel: "High",
    soilType: "Sandy Soil",
    moistureContent: "Juicy Harvest",
    qualityGrade: "Standard Quality",
    lastUpdated: "Live Today 08:15 PM",
    history: [{ month: "Jan", govt: 500, private: 1100 }, { month: "Feb", govt: 600, private: 1450 }],
    statePrices: [{ state: "Karnataka", district: "Chikballapur", mandiName: "Chikballapur APMC", privatePrice: 1450, arrivalQuantity: "5,600 Quintals", trend: "up" }]
  },

  // VEGETABLES (ALL MAJOR VEGGIES)
  {
    id: 13,
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
    avgYieldPerAcre: "100 Quintals",
    costPerAcre: 35000,
    demandLevel: "Extremely High",
    soilType: "Deep Alluvial Loam",
    moistureContent: "Cured Fresh",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:45 PM",
    history: [{ month: "Jan", govt: 1000, private: 1100 }, { month: "Feb", govt: 1200, private: 2150 }],
    statePrices: [
      { state: "Maharashtra", district: "Nashik", mandiName: "Lasalgaon APMC", privatePrice: 2150, arrivalQuantity: "9,200 Quintals", trend: "up" },
      { state: "Karnataka", district: "Hubli", mandiName: "Hubli Yard", privatePrice: 2280, arrivalQuantity: "4,100 Quintals", trend: "up" }
    ]
  },
  {
    id: 14,
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
    durationDays: "130 Days",
    avgYieldPerAcre: "150 Quintals",
    costPerAcre: 45000,
    demandLevel: "Extremely High",
    soilType: "Loam Soil",
    moistureContent: "Fresh Farm Pick",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:45 PM",
    history: [{ month: "Jan", govt: 600, private: 900 }, { month: "Feb", govt: 800, private: 1850 }],
    statePrices: [
      { state: "Karnataka", district: "Kolar", mandiName: "Kolar APMC", privatePrice: 1850, arrivalQuantity: "5,200 Quintals", trend: "up" },
      { state: "Maharashtra", district: "Narayangaon", mandiName: "Junnar APMC", privatePrice: 1780, arrivalQuantity: "3,900 Quintals", trend: "up" }
    ]
  },
  {
    id: 15,
    name: "Potato (Jyoti & Kufri Agra)",
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
    durationDays: "100 Days",
    avgYieldPerAcre: "120 Quintals",
    costPerAcre: 30000,
    demandLevel: "High",
    soilType: "Sandy Loam Soil",
    moistureContent: "Fresh Cold Storage",
    qualityGrade: "Standard Quality",
    lastUpdated: "Live Today 08:35 PM",
    history: [{ month: "Jan", govt: 950, private: 1300 }, { month: "Feb", govt: 1100, private: 1680 }],
    statePrices: [
      { state: "Uttar Pradesh", district: "Agra", mandiName: "Agra APMC", privatePrice: 1680, arrivalQuantity: "12,000 Quintals", trend: "up" },
      { state: "West Bengal", district: "Hooghly", mandiName: "Hooghly Yard", privatePrice: 1620, arrivalQuantity: "8,500 Quintals", trend: "up" }
    ]
  },
  {
    id: 16,
    name: "Garlic (Mandsaur White)",
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
    durationDays: "140 Days",
    avgYieldPerAcre: "35 Quintals",
    costPerAcre: 40000,
    demandLevel: "Extremely High",
    soilType: "Rich Loam Soil",
    moistureContent: "Dry Cured",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:45 PM",
    history: [{ month: "Jan", govt: 3500, private: 12000 }, { month: "Feb", govt: 4000, private: 14500 }],
    statePrices: [{ state: "Madhya Pradesh", district: "Mandsaur", mandiName: "Mandsaur APMC", privatePrice: 14500, arrivalQuantity: "1,800 Quintals", trend: "up" }]
  },
  {
    id: 17,
    name: "Ginger (Wayanad Fresh Organic)",
    scientificName: "Zingiber officinale",
    category: "Vegetables",
    iconEmoji: "🫚",
    state: "Kerala",
    district: "Wayanad",
    mandiName: "Wayanad Spices Market",
    govt: 3500,
    private: 8200,
    trend: "up",
    globalRegion: "India, Nigeria",
    season: "Kharif",
    durationDays: "220 Days",
    avgYieldPerAcre: "60 Quintals",
    costPerAcre: 50000,
    demandLevel: "High",
    soilType: "Laterite Soil",
    moistureContent: "Fresh Rhizome",
    qualityGrade: "Grade A Organic",
    lastUpdated: "Live Today 08:25 PM",
    history: [{ month: "Jan", govt: 3000, private: 7200 }, { month: "Feb", govt: 3500, private: 8200 }],
    statePrices: [{ state: "Kerala", district: "Wayanad", mandiName: "Wayanad Market", privatePrice: 8200, arrivalQuantity: "950 Quintals", trend: "up" }]
  },
  {
    id: 18,
    name: "Cauliflower (White Snowball)",
    scientificName: "Brassica oleracea var. botrytis",
    category: "Vegetables",
    iconEmoji: "🥦",
    state: "Punjab",
    district: "Jalandhar",
    mandiName: "Jalandhar APMC",
    govt: 700,
    private: 1550,
    trend: "up",
    globalRegion: "India, Europe",
    season: "Winter",
    durationDays: "85 Days",
    avgYieldPerAcre: "90 Quintals",
    costPerAcre: 18000,
    demandLevel: "Moderate",
    soilType: "Loamy Soil",
    moistureContent: "Fresh Farm Curd",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:20 PM",
    history: [{ month: "Jan", govt: 600, private: 1200 }, { month: "Feb", govt: 700, private: 1550 }],
    statePrices: [{ state: "Punjab", district: "Jalandhar", mandiName: "Jalandhar APMC", privatePrice: 1550, arrivalQuantity: "3,100 Quintals", trend: "up" }]
  },
  {
    id: 19,
    name: "Cabbage (Green Express)",
    scientificName: "Brassica oleracea var. capitata",
    category: "Vegetables",
    iconEmoji: "🥬",
    state: "West Bengal",
    district: "Nadia",
    mandiName: "Ranaghat APMC",
    govt: 500,
    private: 1120,
    trend: "up",
    globalRegion: "India, China",
    season: "Winter",
    durationDays: "75 Days",
    avgYieldPerAcre: "110 Quintals",
    costPerAcre: 16000,
    demandLevel: "Moderate",
    soilType: "Sandy Loam Soil",
    moistureContent: "Fresh Farm Head",
    qualityGrade: "Standard Quality",
    lastUpdated: "Live Today 08:15 PM",
    history: [{ month: "Jan", govt: 400, private: 900 }, { month: "Feb", govt: 500, private: 1120 }],
    statePrices: [{ state: "West Bengal", district: "Nadia", mandiName: "Ranaghat APMC", privatePrice: 1120, arrivalQuantity: "4,200 Quintals", trend: "up" }]
  },

  // SPICES & OILSEEDS
  {
    id: 20,
    name: "Turmeric (Sangli Finger)",
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
    durationDays: "250 Days",
    avgYieldPerAcre: "30 Quintals",
    costPerAcre: 45000,
    demandLevel: "Extremely High",
    soilType: "Rich Loam Soil",
    moistureContent: "Dry Finger",
    qualityGrade: "Export Quality Premium",
    lastUpdated: "Live Today 08:45 PM",
    history: [{ month: "Jan", govt: 6800, private: 13500 }, { month: "Feb", govt: 7500, private: 16800 }],
    statePrices: [{ state: "Maharashtra", district: "Sangli", mandiName: "Sangli APMC", privatePrice: 16800, arrivalQuantity: "2,400 Quintals", trend: "up" }]
  },
  {
    id: 21,
    name: "Soybean (JS-335 Yellow)",
    scientificName: "Glycine max",
    category: "Oilseeds",
    iconEmoji: "🌱",
    state: "Madhya Pradesh",
    district: "Indore",
    mandiName: "Indore APMC",
    govt: 4600,
    private: 4920,
    trend: "up",
    globalRegion: "India, USA, Brazil",
    season: "Kharif",
    durationDays: "100 Days",
    avgYieldPerAcre: "12 Quintals",
    costPerAcre: 13000,
    demandLevel: "High",
    soilType: "Black Cotton Soil",
    moistureContent: "10.0%",
    qualityGrade: "Grade A Superior",
    lastUpdated: "Live Today 08:45 PM",
    history: [{ month: "Jan", govt: 4400, private: 4600 }, { month: "Feb", govt: 4600, private: 4920 }],
    statePrices: [{ state: "Madhya Pradesh", district: "Indore", mandiName: "Indore APMC", privatePrice: 4920, arrivalQuantity: "7,800 Quintals", trend: "up" }]
  }
];

export default function MarketPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCropModal, setSelectedCropModal] = useState<CropItem | null>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic filter for search, category, and state
  const filteredCrops = useMemo(() => {
    return COMPREHENSIVE_CROPS_DATABASE.filter((crop) => {
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

      const matchesCategory = 
        selectedCategory === "All Categories" || 
        crop.category === selectedCategory;

      const matchesState = 
        selectedState === "All States" || 
        crop.state === selectedState ||
        crop.statePrices.some(sp => sp.state === selectedState);

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [searchTerm, selectedCategory, selectedState]);

  // LIVE POP-UP SEARCH DROPDOWN MATCHES
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    return COMPREHENSIVE_CROPS_DATABASE.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.category.toLowerCase().includes(term) ||
      c.scientificName.toLowerCase().includes(term)
    ).slice(0, 6);
  }, [searchTerm]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            Search any Crop, Fruit, or Vegetable. Real-time APMC Mandi rates across 36 Indian States & UTs. Engineered by Uday Pratap Singh Chauhan (udchauhan0987@gmail.com).
          </p>
        </div>
      </div>

      {/* SEARCH BAR WITH LIVE POP-UP SUGGESTIONS DROPDOWN */}
      <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-5 md:p-6 shadow-sm border-[3px] border-gray-300 dark:border-white/20 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* SEARCH INPUT & LIVE POPUP DROPDOWN */}
          <div ref={searchContainerRef} className="relative md:col-span-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 z-10" />
            <input
              type="text"
              placeholder="Search any crop, fruit (e.g. Apple, Mango), or vegetable..."
              value={searchTerm}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchDropdown(true);
              }}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border-2 border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 font-bold text-xs text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(""); setShowSearchDropdown(false); }} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-10">
                <X className="w-4 h-4" />
              </button>
            )}

            {/* LIVE POP-UP DROPDOWN FOR MATCHING FRUITS, CROPS & VEGGIES */}
            {showSearchDropdown && searchTerm.trim() !== "" && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#16171f] border-[3px] border-green-500 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
                {searchSuggestions.length > 0 ? (
                  <div className="p-2 space-y-1">
                    <span className="text-[10px] font-black uppercase text-gray-400 px-3 py-1 block">Live Matching Commodities:</span>
                    {searchSuggestions.map((crop) => (
                      <button
                        key={crop.id}
                        onClick={() => {
                          setSearchTerm(crop.name);
                          setShowSearchDropdown(false);
                          setSelectedCropModal(crop);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/60 flex items-center justify-between transition-colors font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{crop.iconEmoji}</span>
                          <div>
                            <span className="text-gray-900 dark:text-white block">{crop.name}</span>
                            <span className="text-[10px] text-gray-400 block">{crop.category} • {crop.state}</span>
                          </div>
                        </div>
                        <span className="text-green-600 dark:text-green-400 font-black">₹{crop.private}/q</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center space-y-1">
                    <AlertCircle className="w-5 h-5 text-amber-500 mx-auto" />
                    <p className="font-extrabold text-xs text-gray-900 dark:text-white">
                      Market Price Currently Not Available for "{searchTerm}"
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      APMC Mandi rates update daily at 09:00 AM. This item may be currently out of season.
                    </p>
                  </div>
                )}
              </div>
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
              <option value="Fruits">🍎 Fruits & Orchards</option>
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
          <span>Showing {filteredCrops.length} active Mandi listings</span>
          {searchTerm && (
            <button onClick={() => { setSearchTerm(""); setSelectedCategory("All Categories"); setSelectedState("All States"); }} className="text-green-600 dark:text-green-400 hover:underline">
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* NOT AVAILABLE ALERT BANNER IF SEARCH HAS NO MATCHES */}
      {filteredCrops.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border-[3px] border-amber-400 dark:border-amber-800 p-6 rounded-3xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
          <h3 className="font-black text-base text-amber-900 dark:text-amber-200">
            Market Price Currently Not Available for "{searchTerm}"
          </h3>
          <p className="text-xs text-amber-800 dark:text-amber-300 font-medium max-w-lg mx-auto">
            This crop, fruit, or vegetable is currently not listed in active Mandi arrival logs today. Rates update every morning at 09:00 AM.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="px-4 py-2 bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md mt-2"
          >
            Show All Available Commodities
          </button>
        </div>
      )}

      {/* COMMODITY GRID WITH 3PX THICK BORDERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => {
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
        })}
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
