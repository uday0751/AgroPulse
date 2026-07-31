"use client";

import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Check, CheckCircle2, Droplets, IndianRupee, Info, Leaf, Sprout, TrendingUp, AlertTriangle, CalendarDays, ShieldAlert } from 'lucide-react';

const CROP_DATA = [
  {
    id: 'wheat', name: 'Wheat',
    price: 2400, msp: 2275,
    yield: 18, water: 450,
    season: 'Rabi', risk: 'Low',
    fertilizerCost: 3500, irrigationType: 'Surface/Sprinkler',
    duration: 120,
    trend: [
      { month: 'Jan', price: 2200 }, { month: 'Feb', price: 2250 },
      { month: 'Mar', price: 2300 }, { month: 'Apr', price: 2350 },
      { month: 'May', price: 2380 }, { month: 'Jun', price: 2400 }
    ]
  },
  {
    id: 'rice', name: 'Rice (Paddy)',
    price: 2800, msp: 2183,
    yield: 22, water: 1200,
    season: 'Kharif', risk: 'Medium',
    fertilizerCost: 4500, irrigationType: 'Flood',
    duration: 140,
    trend: [
      { month: 'Jan', price: 2500 }, { month: 'Feb', price: 2600 },
      { month: 'Mar', price: 2650 }, { month: 'Apr', price: 2700 },
      { month: 'May', price: 2750 }, { month: 'Jun', price: 2800 }
    ]
  },
  {
    id: 'cotton', name: 'Cotton',
    price: 7500, msp: 6620,
    yield: 8, water: 700,
    season: 'Kharif', risk: 'High',
    fertilizerCost: 6000, irrigationType: 'Drip',
    duration: 160,
    trend: [
      { month: 'Jan', price: 6800 }, { month: 'Feb', price: 7000 },
      { month: 'Mar', price: 7200 }, { month: 'Apr', price: 7100 },
      { month: 'May', price: 7300 }, { month: 'Jun', price: 7500 }
    ]
  },
  {
    id: 'soybean', name: 'Soybean',
    price: 4800, msp: 4600,
    yield: 10, water: 500,
    season: 'Kharif', risk: 'Medium',
    fertilizerCost: 3000, irrigationType: 'Rainfed/Sprinkler',
    duration: 100,
    trend: [
      { month: 'Jan', price: 4400 }, { month: 'Feb', price: 4500 },
      { month: 'Mar', price: 4650 }, { month: 'Apr', price: 4600 },
      { month: 'May', price: 4700 }, { month: 'Jun', price: 4800 }
    ]
  },
  {
    id: 'sugarcane', name: 'Sugarcane',
    price: 340, msp: 315, // per quintal
    yield: 350, water: 2000,
    season: 'Annual', risk: 'Low',
    fertilizerCost: 10000, irrigationType: 'Surface/Drip',
    duration: 365,
    trend: [
      { month: 'Jan', price: 310 }, { month: 'Feb', price: 315 },
      { month: 'Mar', price: 320 }, { month: 'Apr', price: 330 },
      { month: 'May', price: 335 }, { month: 'Jun', price: 340 }
    ]
  },
  {
    id: 'maize', name: 'Maize',
    price: 2100, msp: 2090,
    yield: 20, water: 550,
    season: 'Kharif', risk: 'Low',
    fertilizerCost: 4000, irrigationType: 'Surface/Rainfed',
    duration: 110,
    trend: [
      { month: 'Jan', price: 1950 }, { month: 'Feb', price: 2000 },
      { month: 'Mar', price: 2050 }, { month: 'Apr', price: 2050 },
      { month: 'May', price: 2080 }, { month: 'Jun', price: 2100 }
    ]
  },
  {
    id: 'bajra', name: 'Bajra',
    price: 2600, msp: 2500,
    yield: 12, water: 300,
    season: 'Kharif', risk: 'Low',
    fertilizerCost: 2000, irrigationType: 'Rainfed',
    duration: 85,
    trend: [
      { month: 'Jan', price: 2400 }, { month: 'Feb', price: 2450 },
      { month: 'Mar', price: 2480 }, { month: 'Apr', price: 2500 },
      { month: 'May', price: 2550 }, { month: 'Jun', price: 2600 }
    ]
  },
  {
    id: 'groundnut', name: 'Groundnut',
    price: 6500, msp: 6377,
    yield: 10, water: 600,
    season: 'Kharif', risk: 'Medium',
    fertilizerCost: 3500, irrigationType: 'Sprinkler',
    duration: 110,
    trend: [
      { month: 'Jan', price: 6100 }, { month: 'Feb', price: 6200 },
      { month: 'Mar', price: 6350 }, { month: 'Apr', price: 6400 },
      { month: 'May', price: 6450 }, { month: 'Jun', price: 6500 }
    ]
  },
  {
    id: 'onion', name: 'Onion',
    price: 2200, msp: 1500,
    yield: 100, water: 700,
    season: 'Rabi', risk: 'High',
    fertilizerCost: 8000, irrigationType: 'Drip/Sprinkler',
    duration: 130,
    trend: [
      { month: 'Jan', price: 1500 }, { month: 'Feb', price: 1200 },
      { month: 'Mar', price: 1400 }, { month: 'Apr', price: 1800 },
      { month: 'May', price: 2500 }, { month: 'Jun', price: 2200 }
    ]
  },
  {
    id: 'tomato', name: 'Tomato',
    price: 3000, msp: 0, // No MSP
    yield: 150, water: 600,
    season: 'Annual', risk: 'High',
    fertilizerCost: 12000, irrigationType: 'Drip',
    duration: 140,
    trend: [
      { month: 'Jan', price: 1200 }, { month: 'Feb', price: 1500 },
      { month: 'Mar', price: 1800 }, { month: 'Apr', price: 2500 },
      { month: 'May', price: 4000 }, { month: 'Jun', price: 3000 }
    ]
  },
];

const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#9333ea'];

export default function CompareCrops() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['wheat', 'rice', 'cotton']);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCrops = useMemo(() => {
    return CROP_DATA.filter(c => selectedIds.includes(c.id));
  }, [selectedIds]);

  const toggleCrop = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev; // min 2
        return prev.filter(c => c !== id);
      } else {
        if (prev.length >= 4) return prev; // max 4
        return [...prev, id];
      }
    });
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".animate-item", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "all"
      });
      gsap.from(".table-row", {
        x: -20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
        clearProps: "all",
        delay: 0.4
      });
    }, containerRef);
    return () => ctx.revert();
  }, [selectedIds]);

  // Combine trend data for chart
  const chartData = useMemo(() => {
    const data: any[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    months.forEach((month, idx) => {
      let dataPoint: any = { name: month };
      selectedCrops.forEach(crop => {
        dataPoint[crop.id] = crop.trend[idx].price;
      });
      data.push(dataPoint);
    });
    return data;
  }, [selectedCrops]);

  // Calculations for recommendation
  const getProfitRatio = (crop: any) => {
    // Note: Estimated profit per acre = (Yield * Price) - Fertilizer Cost (Assume additional fixed costs like labour = 10000)
    const fixedCosts = 10000;
    const revenue = crop.yield * crop.price;
    const totalCost = crop.fertilizerCost + fixedCosts;
    const profit = revenue - totalCost;
    let riskFactor = 1;
    if (crop.risk === 'Medium') riskFactor = 1.2;
    if (crop.risk === 'High') riskFactor = 1.5;
    return profit / riskFactor; // profit to risk ratio
  };

  const recommendedCrop = useMemo(() => {
    if (selectedCrops.length === 0) return null;
    let best = selectedCrops[0];
    let maxRatio = getProfitRatio(best);
    selectedCrops.forEach(c => {
      const ratio = getProfitRatio(c);
      if (ratio > maxRatio) {
        maxRatio = ratio;
        best = c;
      }
    });
    return best;
  }, [selectedCrops]);

  const calcProfit = (crop: any) => {
    const fixedCosts = 10000; // Assumed irrigation & labour costs
    return (crop.yield * crop.price) - (crop.fertilizerCost + fixedCosts);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="animate-item">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Compare Crops</h1>
          <p className="mt-2 text-gray-600">Select up to 4 crops to compare market prices, inputs, and estimated profitability side-by-side.</p>
        </div>

        {/* Selection Area */}
        <div className="animate-item bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Select Crops ({selectedIds.length}/4)
            </h2>
            <span className="text-sm text-gray-500">Minimum 2, Maximum 4</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {CROP_DATA.map(crop => {
              const isSelected = selectedIds.includes(crop.id);
              return (
                <button
                  key={crop.id}
                  onClick={() => toggleCrop(crop.id)}
                  disabled={!isSelected && selectedIds.length >= 4}
                  className={`
                    px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2
                    ${isSelected 
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50/50'}
                    ${!isSelected && selectedIds.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  {crop.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommendation Badge */}
        {recommendedCrop && (
          <div className="animate-item bg-green-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-50" />
              </div>
              <div>
                <h3 className="text-green-100 font-medium text-sm tracking-wide uppercase">Recommended based on selection</h3>
                <p className="text-2xl font-bold">{recommendedCrop.name}</p>
                <p className="text-green-50 text-sm mt-1">Best profit-to-risk ratio among selected crops.</p>
              </div>
            </div>
            <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/20 relative z-10 text-center w-full md:w-auto">
              <p className="text-green-100 text-xs font-medium uppercase tracking-wider mb-1">Est. Profit / Acre</p>
              <p className="text-3xl font-bold text-white">₹{calcProfit(recommendedCrop).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Comparison Table */}
          <div className="lg:col-span-2 animate-item bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-green-600" />
                Detailed Comparison
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 border-b border-gray-100 w-1/4">Metric</th>
                    {selectedCrops.map((crop, idx) => (
                      <th key={crop.id} className="px-6 py-4 font-semibold text-gray-900 border-b border-gray-100 text-center" style={{ color: COLORS[idx] }}>
                        {crop.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><IndianRupee className="w-4 h-4" /> Market Price</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center font-medium">₹{crop.price}/qtl</td>)}
                  </tr>
                  <tr className="table-row bg-gray-50/30">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> MSP</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.msp ? `₹${crop.msp}/qtl` : 'N/A'}</td>)}
                  </tr>
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><Sprout className="w-4 h-4" /> Yield/Acre</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center font-medium">{crop.yield} qtl</td>)}
                  </tr>
                  <tr className="table-row bg-gray-50/30">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><Droplets className="w-4 h-4" /> Water Needs</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.water} mm</td>)}
                  </tr>
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Duration</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.duration} days</td>)}
                  </tr>
                  <tr className="table-row bg-gray-50/30">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><Leaf className="w-4 h-4" /> Season</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.season}</td>)}
                  </tr>
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Risk Level</td>
                    {selectedCrops.map(crop => (
                      <td key={crop.id} className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          crop.risk === 'Low' ? 'bg-green-100 text-green-700' :
                          crop.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {crop.risk}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="table-row bg-gray-50/30">
                    <td className="px-6 py-4 text-gray-500 font-medium">Fertilizer Cost/Acre</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">₹{crop.fertilizerCost}</td>)}
                  </tr>
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium">Irrigation Type</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.irrigationType}</td>)}
                  </tr>
                  <tr className="table-row border-t-2 border-gray-100 bg-green-50/20">
                    <td className="px-6 py-5 text-gray-800 font-bold">Est. Profit/Acre</td>
                    {selectedCrops.map(crop => (
                      <td key={crop.id} className="px-6 py-5 text-center font-bold text-gray-900">
                        ₹{calcProfit(crop).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Chart & Summary */}
          <div className="space-y-8">
            <div className="animate-item bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-green-600" />
                6-Month Price Trend
              </h2>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    {selectedCrops.map((crop, index) => (
                      <Line 
                        key={crop.id} 
                        type="monotone" 
                        dataKey={crop.id} 
                        name={crop.name}
                        stroke={COLORS[index]} 
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="animate-item grid grid-cols-1 gap-4">
               {selectedCrops.map((crop, idx) => (
                 <div key={crop.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                     <span className="font-semibold text-gray-800">{crop.name}</span>
                   </div>
                   <div className="text-right">
                     <div className="text-sm text-gray-500">Duration</div>
                     <div className="font-medium text-gray-900">{crop.duration} days</div>
                   </div>
                 </div>
               ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
