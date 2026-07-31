"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Landmark, FileText, CheckCircle, ExternalLink, Filter, HelpCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Scheme {
  id: string;
  name: string;
  category: "subsidy" | "insurance" | "loan" | "infra";
  sponsor: string;
  benefit: string;
  description: string;
  eligibility: string;
  link: string;
}

const SCHEMES: Scheme[] = [
  { id: "s1", name: "PM-Kisan Samman Nidhi", category: "subsidy", sponsor: "Central Government", benefit: "₹6,000 / year direct income support", description: "Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.", eligibility: "All landholding farmer families in India.", link: "https://pmkisan.gov.in/" },
  { id: "s2", name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", category: "insurance", sponsor: "Central & State Govt", benefit: "Low premium crop insurance against natural calamities", description: "Yield-based crop insurance scheme providing comprehensive financial security against natural disasters and pests.", eligibility: "All farmers growing notified crops in notified areas.", link: "https://pmfby.gov.in/" },
  { id: "s3", name: "Kisan Credit Card (KCC) Scheme", category: "loan", sponsor: "Reserve Bank of India", benefit: "Short term credit loans up to ₹3 Lakh at 4% interest rate", description: "Provides farmers with timely and hassle-free access to short-term credit loans for crop cultivation and maintenance.", eligibility: "All owner-cultivators, tenant farmers, and sharecroppers.", link: "https://www.rbi.org.in/" },
  { id: "s4", name: "Sub-Mission on Agricultural Mechanization (SMAM)", category: "subsidy", sponsor: "Department of Agriculture", benefit: "40% to 50% subsidy on buying tractors, seed drills, harvesters", description: "Promotes farm mechanization by providing subsidies on high-quality farming implements and machinery.", eligibility: "Small, marginal, and women farmers are prioritized.", link: "https://agrimachinery.nic.in/" },
  { id: "s5", name: "Per Drop More Crop (PDMC)", category: "infra", sponsor: "Pradhan Mantri Krishi Sinchayee Yojana", benefit: "Up to 55% subsidy on Drip and Sprinkler Irrigation systems", description: "Promotes efficient water use through micro-irrigation technologies like drip and sprinkler setups.", eligibility: "Farmers with access to stable water source and land.", link: "https://pmksy.gov.in/" },
];

export default function GovernmentSchemes() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [applied, setApplied] = useState(false);
  const [aadhaar, setAadhaar] = useState("");

  const categories = [
    { id: "All", name: "All Schemes" },
    { id: "subsidy", name: "Subsidies" },
    { id: "insurance", name: "Insurance" },
    { id: "loan", name: "Loans" },
    { id: "infra", name: "Infrastructure" }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaar.length === 12) {
      setApplied(true);
      setTimeout(() => {
        setSelectedScheme(null);
        setApplied(false);
        setAadhaar("");
      }, 2500);
    }
  };

  const filteredSchemes = SCHEMES.filter(s => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Government Schemes & Subsidies
          </h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Verify eligibility and apply for agricultural subsidies, schemes, and low-interest loans</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 bg-white font-semibold text-xs text-gray-800"
          />
        </div>
      </header>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === cat.id 
                ? "bg-green-600 border-green-600 text-white shadow-sm" 
                : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map(scheme => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-green-200 transition-colors"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Landmark className="w-6 h-6 text-green-700" />
                </div>
                <span className="text-[10px] font-extrabold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {scheme.sponsor}
                </span>
              </div>

              <h3 className="font-extrabold text-gray-900 text-sm">{scheme.name}</h3>
              <div className="bg-green-50/50 border border-green-100 rounded-xl p-3 my-3 text-xs font-bold text-green-700">
                {scheme.benefit}
              </div>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-4">
                {scheme.description}
              </p>
            </div>

            <div className="flex gap-2 border-t border-gray-50 pt-4 mt-2">
              <button
                onClick={() => setSelectedScheme(scheme)}
                className="flex-1 bg-green-600 text-white hover:bg-green-700 text-xs font-bold py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Apply Now
              </button>
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 border border-gray-200 text-gray-600 hover:text-green-700 hover:border-green-300 rounded-xl flex items-center justify-center transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 relative overflow-hidden"
            >
              <button onClick={() => setSelectedScheme(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>

              {applied ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-extrabold text-gray-900">Application Submitted!</h3>
                  <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
                    Your application for <strong>{selectedScheme.name}</strong> is filed successfully. Your application ID is <strong>EFRM-{Math.floor(100000 + Math.random() * 900000)}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <h3 className="text-base font-extrabold text-gray-900">Apply for Scheme</h3>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs font-semibold text-gray-600">
                    <div className="font-bold text-gray-900 mb-1">{selectedScheme.name}</div>
                    <div>Benefit: {selectedScheme.benefit}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Applicant Aadhaar Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      pattern="\d{12}"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                      className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                      placeholder="Enter 12 digit Aadhaar number"
                    />
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[10px] text-blue-700 font-semibold leading-relaxed flex gap-2">
                    <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Your registered details (Name, State, and District) will be retrieved from your profile to auto-complete this subsidy request form.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
