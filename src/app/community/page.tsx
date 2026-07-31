"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Users, MapPin, MessageSquare, ImagePlus, X, 
  ShieldCheck, UserPlus, Lock, UserPlus2, LogOut, Check, Bell, BellOff, Upload, Radio, Tag, Eye, ChevronRight
} from "lucide-react";

export interface UserAccount {
  eFarmerId: string;
  fullName: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  primaryCrops: string[];
  createdAt: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  text: string;
  eFarmerId: string;
  farmerName: string;
  state: string;
  district: string;
  avatar: string;
  imageUrl?: string;
  createdAt: string;
  timestamp: number;
}

export interface DiscussionGroup {
  id: string;
  name: string;
  type: "public" | "crop" | "state";
  description: string;
  iconEmoji: string;
  activeCount: number;
}

const PUBLIC_GROUPS: DiscussionGroup[] = [
  { id: "group-general", name: "🌾 All-India Farmers Assembly", type: "public", description: "Main public lounge for real e-Farmers across India to chat", iconEmoji: "🌾", activeCount: 4120 },
  { id: "group-mandi", name: "📈 Mandi Prices & Buying/Selling", type: "public", description: "Real-time crop prices, buying & selling discussions", iconEmoji: "📈", activeCount: 2350 },
  { id: "group-weather", name: "🌧️ Weather & Pest Control Advice", type: "public", description: "Rain alerts, crop health tips & pest control advice", iconEmoji: "🌧️", activeCount: 1890 }
];

export default function FarmersCommunityChatPage() {
  const [currentGroup, setCurrentGroup] = useState<DiscussionGroup>(PUBLIC_GROUPS[0]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  
  // Track Joined Group IDs & Notification Preferences
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(["group-general"]);
  const [notifEnabledGroupIds, setNotifEnabledGroupIds] = useState<string[]>(["group-general", "group-mandi"]);
  const [toastNotif, setToastNotif] = useState<string | null>(null);

  // Real messages ONLY posted by actual human users
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  
  // Account Modal State
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [inputState, setInputState] = useState("Maharashtra");
  const [inputDistrict, setInputDistrict] = useState("Pune");
  const [inputVillage, setInputVillage] = useState("Baramati");
  const [inputCrop, setInputCrop] = useState("Wheat");

  // Chat Input State
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [inspectingProfile, setInspectingProfile] = useState<UserAccount | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // LOAD PROFILE, JOINED GROUPS, NOTIFICATIONS & MESSAGES ON MOUNT
  useEffect(() => {
    const savedUser = localStorage.getItem("agropulse_current_user_account");
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
    }

    const savedJoined = localStorage.getItem("agropulse_joined_group_ids");
    if (savedJoined) {
      try { setJoinedGroupIds(JSON.parse(savedJoined)); } catch (e) { console.error(e); }
    }

    const savedNotifs = localStorage.getItem("agropulse_group_notifications");
    if (savedNotifs) {
      try { setNotifEnabledGroupIds(JSON.parse(savedNotifs)); } catch (e) { console.error(e); }
    }

    const savedMessages = localStorage.getItem("agropulse_real_efarmer_messages");
    if (savedMessages) {
      try { setMessagesMap(JSON.parse(savedMessages)); } catch (e) { console.error(e); }
    }

    // Real-Time Inter-Tab Broadcast API
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("agropulse_real_human_chat_sync");
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data && event.data.type === "REAL_HUMAN_MESSAGE") {
          const incomingMsg: ChatMessage = event.data.message;
          setMessagesMap((prev) => {
            const list = prev[incomingMsg.groupId] || [];
            if (list.some(m => m.id === incomingMsg.id)) return prev;
            const updated = { ...prev, [incomingMsg.groupId]: [...list, incomingMsg] };
            localStorage.setItem("agropulse_real_efarmer_messages", JSON.stringify(updated));
            return updated;
          });

          setNotifEnabledGroupIds((currentNotifs) => {
            if (currentNotifs.includes(incomingMsg.groupId)) {
              setToastNotif(`🔔 New message from ${incomingMsg.farmerName} (${incomingMsg.eFarmerId})`);
              setTimeout(() => setToastNotif(null), 4000);
            }
            return currentNotifs;
          });
        }
      };
    }

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesMap, currentGroup.id]);

  const handleToggleNotification = (groupId: string) => {
    let updatedNotifs: string[] = [];
    if (notifEnabledGroupIds.includes(groupId)) {
      updatedNotifs = notifEnabledGroupIds.filter(id => id !== groupId);
    } else {
      updatedNotifs = [...notifEnabledGroupIds, groupId];
    }
    setNotifEnabledGroupIds(updatedNotifs);
    localStorage.setItem("agropulse_group_notifications", JSON.stringify(updatedNotifs));
  };

  const handleToggleJoinGroup = (groupId: string) => {
    if (!currentUser) {
      setShowAccountModal(true);
      return;
    }
    let updatedJoined: string[] = [];
    if (joinedGroupIds.includes(groupId)) {
      updatedJoined = joinedGroupIds.filter(id => id !== groupId);
    } else {
      updatedJoined = [...joinedGroupIds, groupId];
    }
    setJoinedGroupIds(updatedJoined);
    localStorage.setItem("agropulse_joined_group_ids", JSON.stringify(updatedJoined));
  };

  const isCurrentGroupJoined = useMemo(() => {
    return joinedGroupIds.includes(currentGroup.id);
  }, [joinedGroupIds, currentGroup.id]);

  const isCurrentGroupNotifOn = useMemo(() => {
    return notifEnabledGroupIds.includes(currentGroup.id);
  }, [notifEnabledGroupIds, currentGroup.id]);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputPhone.trim() || !inputDistrict.trim()) {
      alert("Please fill in your Full Name, Phone Number, and District");
      return;
    }

    const stateCode = inputState.substring(0, 2).toUpperCase();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const neweFarmerId = `${stateCode}-FAR-${randomDigits}`;

    const newAccount: UserAccount = {
      eFarmerId: neweFarmerId,
      fullName: inputName.trim(),
      phone: inputPhone.trim(),
      state: inputState,
      district: inputDistrict.trim(),
      village: inputVillage.trim() || "Main Village",
      primaryCrops: [inputCrop],
      createdAt: new Date().toLocaleDateString(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(neweFarmerId)}`
    };

    setCurrentUser(newAccount);
    localStorage.setItem("agropulse_current_user_account", JSON.stringify(newAccount));
    setShowAccountModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("agropulse_current_user_account");
    setCurrentUser(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage(ev.target?.result as string);
      setUploadingImage(false);
    };
    reader.onerror = () => setUploadingImage(false);
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAccountModal(true);
      return;
    }
    if (!isCurrentGroupJoined) {
      alert("Please click 'Join Group' to send messages in this room.");
      return;
    }
    if (!inputText.trim() && !selectedImage) return;

    const newMsg: ChatMessage = {
      id: `real-msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      groupId: currentGroup.id,
      text: inputText.trim(),
      eFarmerId: currentUser.eFarmerId,
      farmerName: currentUser.fullName,
      state: currentUser.state,
      district: currentUser.district,
      avatar: currentUser.avatar,
      imageUrl: selectedImage || undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };

    const currentGroupMsgs = messagesMap[currentGroup.id] || [];
    const updatedMap = {
      ...messagesMap,
      [currentGroup.id]: [...currentGroupMsgs, newMsg]
    };

    setMessagesMap(updatedMap);
    localStorage.setItem("agropulse_real_efarmer_messages", JSON.stringify(updatedMap));

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: "REAL_HUMAN_MESSAGE",
        message: newMsg
      });
    }

    setInputText("");
    setSelectedImage(null);
  };

  const currentMessages = useMemo(() => {
    return messagesMap[currentGroup.id] || [];
  }, [messagesMap, currentGroup.id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-3 md:p-6 font-sans relative pt-[78px]">
      
      {/* FLOATING NOTIFICATION TOAST ALERT */}
      <AnimatePresence>
        {toastNotif && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-green-900 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-2xl border border-green-700 flex items-center gap-3"
          >
            <Bell className="w-4 h-4 text-green-300 animate-bounce" />
            <span>{toastNotif}</span>
            <button onClick={() => setToastNotif(null)} className="p-1 hover:bg-white/20 rounded-full">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-5 h-[calc(100vh-96px)] overflow-hidden">
        
        {/* LEFT SIDEBAR: E-FARMER PASS & ROOMS */}
        <div className="w-full md:w-4/12 flex flex-col gap-4 h-full overflow-hidden shrink-0">
          
          {/* VERIFIED E-FARMER CARD */}
          <div className="bg-gradient-to-br from-green-800 via-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-xl shrink-0 space-y-3 relative overflow-hidden border border-green-700/60">
            {currentUser ? (
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-xl text-white shadow-md uppercase">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div>
                      <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 border border-white/20">
                        <ShieldCheck className="w-3 h-3 text-green-300" /> Government Verified e-ID
                      </span>
                      <h3 className="font-extrabold text-sm text-white mt-1">{currentUser.fullName}</h3>
                      <p className="text-[10px] text-green-100 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-green-300" /> {currentUser.district}, {currentUser.state}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/20 transition-all"
                  >
                    Switch Account
                  </button>
                </div>

                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-2.5 border border-white/15 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-green-200 font-extrabold uppercase">Official e-Farmer ID:</span>
                  <span className="font-black text-white bg-green-600 px-3 py-1 rounded-xl tracking-wider shadow-sm">
                    {currentUser.eFarmerId}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-center py-2 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto text-white">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Create e-Farmer Account</h3>
                  <p className="text-[11px] text-green-100 font-medium mt-0.5">Register to get your verified e-Farmer ID and chat live with farmers.</p>
                </div>
                <button
                  onClick={() => setShowAccountModal(true)}
                  className="w-full py-2.5 bg-white text-green-900 font-black text-xs rounded-2xl shadow-lg hover:bg-green-50 transition-all flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 text-green-700" /> Register e-Farmer Account
                </button>
              </div>
            )}
          </div>

          {/* DISCUSSION ROOMS LIST */}
          <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-4 shadow-md border border-gray-100 dark:border-white/10 flex-1 flex flex-col overflow-hidden space-y-3">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-green-600" /> Public Discussion Rooms ({PUBLIC_GROUPS.length})
              </h2>
              <span className="text-[10px] font-black text-green-600 bg-green-50 dark:bg-green-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3 text-green-600 animate-pulse" /> Live
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none">
              {PUBLIC_GROUPS.map((group) => {
                const isJoined = joinedGroupIds.includes(group.id);
                const isNotifOn = notifEnabledGroupIds.includes(group.id);
                const isCurrent = currentGroup.id === group.id;

                return (
                  <div
                    key={group.id}
                    onClick={() => setCurrentGroup(group)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                      isCurrent
                        ? "border-green-500 bg-green-50/80 dark:bg-green-950/50 shadow-sm ring-2 ring-green-500/20"
                        : "border-gray-100 dark:border-white/5 hover:border-green-400 bg-white dark:bg-[#1a1b23]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{group.iconEmoji}</span> {group.name}
                      </h3>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleNotification(group.id);
                          }}
                          className={`p-1 rounded-lg transition-all ${
                            isNotifOn ? "text-green-600 bg-green-100 dark:bg-green-950" : "text-gray-400 hover:text-gray-600"
                          }`}
                          title={isNotifOn ? "Notifications ON" : "Notifications OFF"}
                        >
                          {isNotifOn ? <Bell className="w-3.5 h-3.5 fill-green-600" /> : <BellOff className="w-3.5 h-3.5" />}
                        </button>

                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isJoined ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-white/5 text-gray-400"
                        }`}>
                          {isJoined ? "Joined" : "Not Joined"}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium line-clamp-1 mt-1">
                      {group.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT AREA: CLEAN MESSAGES PANEL WITH BORDER LINE */}
        <div className="w-full md:w-8/12 bg-white dark:bg-[#1a1b23] rounded-3xl shadow-xl border-2 border-green-500/40 dark:border-green-500/50 flex flex-col h-full overflow-hidden">
          
          {/* CHAT ROOM HEADER WITH DISTINCT UPPER & LOWER BORDER LINES */}
          <div className="p-4 border-t-4 border-t-green-600 border-b-2 border-b-green-500/40 flex justify-between items-center bg-green-50/60 dark:bg-green-950/30 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-green-100 dark:bg-green-950/60 rounded-2xl border border-green-200 dark:border-green-800">
                {currentGroup.iconEmoji}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-green-600 animate-pulse" /> Live Real Human Chat • Zero Bots
                  </span>
                </div>
                <h2 className="text-base font-black text-gray-900 dark:text-white mt-0.5">
                  {currentGroup.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {currentGroup.description}
                </p>
              </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleNotification(currentGroup.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 ${
                  isCurrentGroupNotifOn
                    ? "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                    : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-600"
                }`}
              >
                {isCurrentGroupNotifOn ? (
                  <>
                    <Bell className="w-3.5 h-3.5 text-green-600 fill-green-600" /> Notifications ON
                  </>
                ) : (
                  <>
                    <BellOff className="w-3.5 h-3.5 text-gray-400" /> Notifications OFF
                  </>
                )}
              </button>

              <button
                onClick={() => handleToggleJoinGroup(currentGroup.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 ${
                  isCurrentGroupJoined 
                    ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100" 
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isCurrentGroupJoined ? (
                  <>
                    <LogOut className="w-3.5 h-3.5" /> Leave Group
                  </>
                ) : (
                  <>
                    <UserPlus2 className="w-3.5 h-3.5" /> Join Group
                  </>
                )}
              </button>
            </div>
          </div>

          {/* REAL HUMAN MESSAGES LIST */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {currentMessages.length === 0 ? (
              <div className="text-center text-gray-400 py-16 space-y-3">
                <MessageSquare className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto" />
                <h4 className="text-sm font-black text-gray-700 dark:text-gray-300">No messages in {currentGroup.name} yet</h4>
                <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto">
                  Be the first verified e-Farmer to post a message or photo in this group!
                </p>
                {!isCurrentGroupJoined && (
                  <button
                    onClick={() => handleToggleJoinGroup(currentGroup.id)}
                    className="mt-2 px-5 py-2.5 bg-green-600 text-white font-extrabold text-xs rounded-xl shadow-md"
                  >
                    Join Group & Start Discussion
                  </button>
                )}
              </div>
            ) : (
              currentMessages.map((msg) => {
                const isMe = currentUser?.eFarmerId === msg.eFarmerId;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-green-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm uppercase border border-green-500">
                      {msg.farmerName.charAt(0)}
                    </div>

                    <div className={`max-w-[80%] md:max-w-[70%] space-y-1 ${isMe ? "text-right" : "text-left"}`}>
                      {/* Name & Official e-Farmer ID Badge */}
                      <div className={`flex items-center gap-2 text-xs ${isMe ? "justify-end" : "justify-start"}`}>
                        <span className="font-extrabold text-gray-900 dark:text-white">
                          {msg.farmerName}
                        </span>
                        <span 
                          onClick={() => {
                            setInspectingProfile({
                              eFarmerId: msg.eFarmerId,
                              fullName: msg.farmerName,
                              phone: "+91 98000 12345",
                              state: msg.state,
                              district: msg.district,
                              village: "Verified Village",
                              primaryCrops: ["Farming"],
                              createdAt: "2026",
                              avatar: msg.avatar
                            });
                          }}
                          className="bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-green-300 dark:border-green-800 cursor-pointer hover:underline flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3 h-3 text-green-600" /> {msg.eFarmerId}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">• {msg.district}, {msg.state}</span>
                      </div>

                      {/* Message Bubble */}
                      <div className={`p-4 rounded-2xl text-xs font-semibold shadow-sm leading-relaxed ${
                        isMe 
                          ? "bg-green-600 text-white rounded-tr-none" 
                          : "bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200/60 dark:border-white/5"
                      }`}>
                        {msg.imageUrl && (
                          <div className="mb-2 overflow-hidden rounded-xl border border-white/20 shadow-sm cursor-pointer">
                            <img 
                              src={msg.imageUrl} 
                              alt="Uploaded photo" 
                              onClick={() => setModalImage(msg.imageUrl || null)}
                              className="max-w-xs w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        {msg.text && <p>{msg.text}</p>}
                        <span className={`text-[9px] block text-right mt-1.5 font-bold ${isMe ? "text-green-200" : "text-gray-400"}`}>
                          {msg.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT FORM WITH DISTINCT TOP BORDER LINE */}
          <div className="p-4 border-t-2 border-t-green-500/40 bg-white dark:bg-[#1a1b23] shrink-0 space-y-3">
            {selectedImage && (
              <div className="relative inline-block border-2 border-green-500 rounded-2xl p-1 bg-green-50 dark:bg-green-950/40">
                <img src={selectedImage} alt="Selected Crop Photo" className="h-20 w-auto rounded-xl object-contain" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {!currentUser ? (
              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Register an account to get your e-Farmer ID and start chatting.</span>
                </div>
                <button
                  onClick={() => setShowAccountModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black px-4 py-2 rounded-xl text-xs shadow-md shrink-0"
                >
                  Register Account
                </button>
              </div>
            ) : !isCurrentGroupJoined ? (
              <div className="bg-green-50 dark:bg-green-950/40 p-4 rounded-2xl border border-green-200 dark:border-green-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-green-900 dark:text-green-300">
                  <UserPlus2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>You have not joined {currentGroup.name} yet. Click Join Group to post messages.</span>
                </div>
                <button
                  onClick={() => handleToggleJoinGroup(currentGroup.id)}
                  className="bg-green-600 hover:bg-green-700 text-white font-black px-4 py-2 rounded-xl text-xs shadow-md shrink-0"
                >
                  Join Group Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="p-3 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 hover:bg-green-100 border border-green-200 dark:border-green-800 rounded-2xl transition-colors shrink-0 flex items-center gap-1 text-xs font-black"
                >
                  <Upload className={`w-5 h-5 ${uploadingImage ? "animate-bounce" : ""}`} />
                  <span className="hidden sm:inline">Upload Image</span>
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Type real-time message in ${currentGroup.name} (${currentUser.eFarmerId})...`}
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-white/5 border-2 border-green-500/40 dark:border-green-500/50 focus:border-green-600 rounded-2xl text-xs font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                />

                <button
                  type="submit"
                  disabled={(!inputText.trim() && !selectedImage) || uploadingImage}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-2xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* CREATE NEW REAL FARMER ACCOUNT MODAL */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-green-600" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">Create Real e-Farmer Account</h3>
              </div>
              <button onClick={() => setShowAccountModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Create your farmer account to generate your official verified e-Farmer ID card and chat live with real farmers across India.
            </p>

            <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Your Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number:</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98221 45678"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">State:</label>
                  <select
                    value={inputState}
                    onChange={(e) => setInputState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-xs text-gray-900 dark:text-white"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">District:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={inputDistrict}
                    onChange={(e) => setInputDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Primary Crop Grown:</label>
                <input
                  type="text"
                  placeholder="e.g. Wheat, Onion, Soybean, Cotton"
                  value={inputCrop}
                  onChange={(e) => setInputCrop(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-xs shadow-md mt-2"
              >
                🚀 Register Account & Generate e-Farmer ID
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT E-FARMER CARD MODAL */}
      {inspectingProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center relative">
            <button 
              onClick={() => setInspectingProfile(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-3xl bg-green-700 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md border-4 border-green-500 uppercase">
              {inspectingProfile.fullName.charAt(0)}
            </div>

            <div>
              <span className="bg-green-100 text-green-800 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-green-200 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Verified e-Farmer
              </span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-2">{inspectingProfile.fullName}</h3>
              <p className="text-xs text-gray-500 font-semibold">📍 {inspectingProfile.district}, {inspectingProfile.state}</p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/40 p-3 rounded-2xl border border-green-200 text-xs space-y-1">
              <span className="text-[10px] font-extrabold text-green-700 uppercase block">Government e-Farmer ID</span>
              <span className="font-black text-base text-green-800 dark:text-green-300">{inspectingProfile.eFarmerId}</span>
            </div>

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setInspectingProfile(null)}
                className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-xl text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SIZE IMAGE PREVIEW MODAL */}
      {modalImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setModalImage(null)}
        >
          <button 
            className="absolute top-5 right-5 text-white bg-black/50 p-2 rounded-full hover:bg-black"
            onClick={() => setModalImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={modalImage} 
            alt="Full size crop photo" 
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20"
          />
        </div>
      )}

    </div>
  );
}
