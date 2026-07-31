"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Star, Calendar, MessageSquare, Video, PhoneCall, X, CheckCircle, Search, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Expert {
  id: string;
  name: string;
  category: "soil" | "pest" | "disease" | "organic";
  title: string;
  rating: number;
  experience: number;
  languages: string[];
  avatar: string;
  availability: string;
}

const EXPERTS: Expert[] = [
  { id: "e1", name: "Dr. Ramesh Patel", category: "pest", title: "Entomologist & Pest Control Expert", rating: 4.9, experience: 12, languages: ["English", "Hindi", "Gujarati"], avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150", availability: "Mon - Fri, 10 AM - 4 PM" },
  { id: "e2", name: "Dr. Ananya Rao", category: "soil", title: "Soil Health & Nutrient Specialist", rating: 4.8, experience: 8, languages: ["English", "Telugu", "Hindi"], avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=150&h=150", availability: "Mon - Sat, 9 AM - 1 PM" },
  { id: "e3", name: "Dr. Gurcharan Singh", category: "disease", title: "Plant Pathologist (Crop Diseases)", rating: 4.9, experience: 15, languages: ["Punjabi", "Hindi", "English"], avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&h=150", availability: "Tue - Thu, 2 PM - 6 PM" },
  { id: "e4", name: "Prof. Savitri Devi", category: "organic", title: "Organic Farming & Permaculture Specialist", rating: 4.7, experience: 10, languages: ["Hindi", "Marathi", "Bengali"], avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150", availability: "Mon - Fri, 3 PM - 7 PM" },
];

export default function ExpertConsultation() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Booking modal state
  const [bookingExpert, setBookingExpert] = useState<Expert | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Chat window state
  const [chatExpert, setChatExpert] = useState<Expert | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "expert"; text: string; time: string }[]>([
    { sender: "expert", text: "Hello! How can I assist you with your crops today?", time: "10:00 AM" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Video call overlay state
  const [activeCall, setActiveCall] = useState<{ expert: Expert; type: "video" | "voice" } | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const categories = [
    { id: "All", name: "All Specialties" },
    { id: "soil", name: "Soil Health" },
    { id: "pest", name: "Pest Management" },
    { id: "disease", name: "Plant Diseases" },
    { id: "organic", name: "Organic Farming" }
  ];

  const handleBook = (expert: Expert) => {
    setBookingExpert(expert);
    setBookingConfirmed(false);
  };

  const confirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingDate && bookingTime) {
      setBookingConfirmed(true);
      setTimeout(() => {
        setBookingExpert(null);
        setBookingConfirmed(false);
      }, 2500);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: "user", text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput("");
    
    // Auto reply mock
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: "expert", text: "Got it. Could you upload a picture of the affected leaves so I can diagnose it better?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1500);
  };

  const filteredExperts = EXPERTS.filter(e => {
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Consult Agricultural Experts
          </h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Book private consultations and consult verified agronomists</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search experts by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 bg-white font-semibold text-xs text-gray-800"
          />
        </div>
      </header>

      {/* Specialties filter tabs */}
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

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredExperts.map(expert => (
          <motion.div
            key={expert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-green-200 transition-colors"
          >
            <div>
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-full h-full rounded-full object-cover border-2 border-green-500"
                />
                <span className="absolute bottom-0 right-0 bg-green-100 border border-green-500 text-green-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-green-700 text-green-700" />
                  {expert.rating}
                </span>
              </div>

              <div className="text-center">
                <h3 className="font-extrabold text-gray-900 text-sm">{expert.name}</h3>
                <p className="text-green-600 text-xs font-bold mt-0.5">{expert.title}</p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {expert.languages.map((lng, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {lng}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-50 mt-4 pt-4 text-xs font-semibold text-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="text-gray-900">{expert.experience} Years</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className="text-gray-900 text-right truncate max-w-[120px]">{expert.availability}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => handleBook(expert)}
                className="bg-green-600 text-white hover:bg-green-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-4 h-4" /> Book
              </button>
              <button
                onClick={() => setChatExpert(expert)}
                className="bg-green-50 border border-green-100 text-green-700 hover:bg-green-100 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Chat
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingExpert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 relative overflow-hidden"
            >
              <button onClick={() => setBookingExpert(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>

              {bookingConfirmed ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-extrabold text-gray-900">Consultation Scheduled!</h3>
                  <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
                    Your appointment with <strong>{bookingExpert.name}</strong> is confirmed. You'll receive a notification and link to join 10 minutes prior to the scheduled slot.
                  </p>
                </div>
              ) : (
                <form onSubmit={confirmBooking} className="space-y-4">
                  <h3 className="text-base font-extrabold text-gray-900">Book Appointment</h3>
                  <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <img src={bookingExpert.avatar} alt={bookingExpert.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{bookingExpert.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">{bookingExpert.title}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Select Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Select Time Slot</label>
                    <select
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-green-500 bg-gray-50"
                    >
                      <option value="">Choose a slot...</option>
                      <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                      <option value="11:30 AM">11:30 AM - 12:00 PM</option>
                      <option value="02:00 PM">02:00 PM - 02:30 PM</option>
                      <option value="04:30 PM">04:30 PM - 05:00 PM</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-green-700 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-out Chat Window */}
      <AnimatePresence>
        {chatExpert && (
          <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 border-l border-gray-100 flex flex-col justify-between">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex gap-3 items-center">
                <img src={chatExpert.avatar} alt={chatExpert.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{chatExpert.name}</h4>
                  <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                  </span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setActiveCall({ expert: chatExpert, type: "video" })} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <Video className="w-4 h-4" />
                </button>
                <button onClick={() => setActiveCall({ expert: chatExpert, type: "voice" })} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <PhoneCall className="w-4 h-4" />
                </button>
                <button onClick={() => setChatExpert(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-xs font-semibold ${
                    msg.sender === "user" ? "bg-green-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}>
                    <div>{msg.text}</div>
                    <span className={`text-[8px] font-bold mt-1 block text-right ${msg.sender === "user" ? "text-green-200" : "text-gray-400"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button type="submit" className="bg-green-600 text-white px-4 rounded-xl text-xs font-bold">
                Send
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>

      {/* Video / Voice Call Placeholder UI overlay */}
      <AnimatePresence>
        {activeCall && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center text-white relative overflow-hidden"
            >
              {activeCall.type === "video" ? (
                <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm" style={{ backgroundImage: `url(${activeCall.expert.avatar})` }} />
              ) : null}

              <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-green-500 shadow-xl">
                  <img src={activeCall.expert.avatar} alt={activeCall.expert.name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold">{activeCall.expert.name}</h3>
                  <p className="text-green-400 text-xs font-bold mt-1 uppercase tracking-wider">{activeCall.type} Consult Call</p>
                </div>

                {/* Call Status / Waveforms */}
                <div className="py-8 flex justify-center gap-1.5 items-center">
                  <span className="w-2 h-4 bg-green-500 rounded-full animate-pulse" />
                  <span className="w-2 h-8 bg-green-400 rounded-full animate-pulse delay-75" />
                  <span className="w-2 h-12 bg-green-500 rounded-full animate-pulse delay-150" />
                  <span className="w-2 h-6 bg-green-400 rounded-full animate-pulse delay-300" />
                  <span className="w-2 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setActiveCall(null)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors shadow-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="text-gray-500 text-xs font-bold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Secure, encrypted consult call
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
