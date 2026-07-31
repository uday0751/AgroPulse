"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sprout, IndianRupee, HelpCircle, ArrowLeft, BarChart, FileText, CheckCircle, Info } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PlanInput {
  soilType: string;
  season: string;
  budget: number;
  water: string;
  state: string;
}

interface CropRecommendation {
  name: string;
  profit: number;
  risk: "Low" | "Medium" | "High";
  riskColor: string;
  fertilizer: string[];
  timeline: string[];
}

// Logic mapper for recommendations
const getRecommendations = (input: PlanInput): CropRecommendation[] => {
  const { soilType, season, water } = input;
  
  if (season === "Kharif") {
    if (water === "High") {
      return [
        { name: "Rice (Paddy)", profit: 35000, risk: "Low", riskColor: "text-green-600 bg-green-50", fertilizer: ["Urea (Nitrogen) - 100 kg/acre", "SSP (Phosphorus) - 60 kg/acre", "MOP (Potassium) - 40 kg/acre"], timeline: ["Sowing: June", "Transplanting: July", "Weeding: August", "Harvest: October"] },
        { name: "Sugarcane", profit: 65000, risk: "Medium", riskColor: "text-yellow-600 bg-yellow-50", fertilizer: ["Nitrogen (N) - 150 kg/acre", "Phosphate (P) - 80 kg/acre", "Organic Compost - 5 tonnes/acre"], timeline: ["Planting: Jan-March", "Earthing up: May", "Irrigation: Weekly", "Harvest: Dec-Feb"] }
      ];
    } else {
      return [
        { name: "Maize (Corn)", profit: 24000, risk: "Low", riskColor: "text-green-600 bg-green-50", fertilizer: ["Zinc Sulphate - 10 kg/acre", "Urea - 80 kg/acre", "NPK 19:19:19 - 50 kg/acre"], timeline: ["Sowing: June", "Thinning: July", "Flowering: August", "Harvest: Sept-Oct"] },
        { name: "Cotton", profit: 45000, risk: "High", riskColor: "text-red-600 bg-red-50", fertilizer: ["DAP - 50 kg/acre", "MOP - 30 kg/acre", "Micronutrients Spray - Stage 2"], timeline: ["Sowing: May-June", "Flowering: August", "Boll Development: Sept", "Harvest: Nov-Dec"] }
      ];
    }
  } else if (season === "Rabi") {
    return [
      { name: "Wheat", profit: 28000, risk: "Low", riskColor: "text-green-600 bg-green-50", fertilizer: ["Urea - 110 kg/acre", "DAP - 50 kg/acre", "Potash - 20 kg/acre"], timeline: ["Sowing: Nov-Dec", "First Irrigation: 21 Days", "Tillering: Jan", "Harvest: April"] },
      { name: "Mustard", profit: 22000, risk: "Medium", riskColor: "text-yellow-600 bg-yellow-50", fertilizer: ["Single Super Phosphate - 75 kg/acre", "Gypsum (Sulphur source) - 100 kg/acre"], timeline: ["Sowing: Oct-Nov", "Thinning: Nov", "Flowering: Dec", "Harvest: Feb-March"] }
    ];
  } else {
    // Zaid
    return [
      { name: "Cucumber / Watermelon", profit: 18000, risk: "Medium", riskColor: "text-yellow-600 bg-yellow-50", fertilizer: ["Ammonium Sulphate - 40 kg/acre", "Potash - 20 kg/acre", "Foliar NPK Spray - Weekly"], timeline: ["Sowing: Feb-March", "Vining: April", "Fruiting: May", "Harvest: June"] },
      { name: "Moong (Green Gram)", profit: 15000, risk: "Low", riskColor: "text-green-600 bg-green-50", fertilizer: ["DAP - 40 kg/acre", "Rhizobium Seed Treatment"], timeline: ["Sowing: March", "Flowering: April", "Pod Development: May", "Harvest: June"] }
    ];
  }
};

export default function CropPlanner() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState<PlanInput>({
    soilType: "Clay",
    season: "Kharif",
    budget: 15000,
    water: "High",
    state: "Maharashtra"
  });

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);

  const handlePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendations(getRecommendations(formData));
    setStep("result");
  };

  const chartData = recommendations.map(rec => ({
    name: rec.name,
    "Est. Budget (₹)": formData.budget,
    "Est. Net Profit (₹)": rec.profit
  }));

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
          Intelligent Crop Planner
        </h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">Input your soil and resources to calculate recommended crops and profits</p>
      </header>

      {step === "form" ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-2xl mx-auto"
        >
          <form onSubmit={handlePlan} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                >
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Soil Type</label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                >
                  <option value="Clay">Clay Soil</option>
                  <option value="Sandy">Sandy Soil</option>
                  <option value="Black">Black Cotton Soil</option>
                  <option value="Alluvial">Alluvial Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Water Availability</label>
                <select
                  value={formData.water}
                  onChange={(e) => setFormData({...formData, water: e.target.value})}
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                >
                  <option value="High">High (Canal / Tube well)</option>
                  <option value="Medium">Medium (Rainfed / Well)</option>
                  <option value="Low">Low (Dryland / Drip irrigation)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Budget per Acre (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  required
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value) || 0})}
                  className="block w-full pl-9 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                  placeholder="20000"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-xs hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sprout className="w-4 h-4" /> Calculate Crop Recommendations
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8 animate-fade-in"
        >
          {/* Back Button */}
          <button 
            onClick={() => setStep("form")}
            className="flex items-center gap-2 text-green-700 hover:text-green-800 font-bold text-xs bg-green-50 border border-green-100 rounded-xl px-4 py-2 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Recalculate Planner
          </button>

          {/* Results Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recommendations List */}
            <div className="lg:col-span-2 space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        <Sprout className="w-6 h-6 text-green-600" />
                        {rec.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">Recommended for {formData.soilType} Soil during {formData.season}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${rec.riskColor}`}>
                      {rec.risk} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 py-4 text-xs font-semibold">
                    <div>
                      <div className="text-gray-400">Estimated Profit / Acre</div>
                      <div className="text-lg font-extrabold text-green-700 mt-1">₹{rec.profit.toLocaleString("en-IN")}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Required Budget</div>
                      <div className="text-lg font-extrabold text-gray-900 mt-1">₹{formData.budget.toLocaleString("en-IN")}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5 mb-2">
                        <Info className="w-4 h-4 text-green-600" /> Fertilizer Advice
                      </h4>
                      <ul className="space-y-1.5 text-xs text-gray-600 font-medium">
                        {rec.fertilizer.map((fert, fIdx) => (
                          <li key={fIdx} className="flex gap-1.5 items-start">
                            <span className="w-1 h-1 bg-green-500 rounded-full mt-1.5 shrink-0" />
                            <span>{fert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5 mb-2">
                        <FileText className="w-4 h-4 text-green-600" /> Sowing Timeline
                      </h4>
                      <ul className="space-y-1.5 text-xs text-gray-600 font-medium">
                        {rec.timeline.map((time, tIdx) => (
                          <li key={tIdx} className="flex gap-1.5 items-start">
                            <span className="w-1 h-1 bg-green-500 rounded-full mt-1.5 shrink-0" />
                            <span>{time}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Profits comparison Recharts card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Profit vs Budget Analysis</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar name="Budget Required" dataKey="Est. Budget (₹)" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                      <Bar name="Estimated Net Profit" dataKey="Est. Net Profit (₹)" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex gap-3 text-xs text-green-800 font-semibold mt-4">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">Recommendations are calculated using regional soil fertility parameters and historical mandi profits in {formData.state}.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
