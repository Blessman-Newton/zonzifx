import React, { useState } from "react";
import { 
  Lock, 
  ShieldAlert, 
  Settings, 
  Users, 
  BookOpen, 
  TrendingUp, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Save, 
  LogOut, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { Program, Testimonial, TradeResult, AcademyApplication } from "../types";

interface AdminPortalProps {
  programs: Program[];
  setPrograms: (programs: Program[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  tradeResults: TradeResult[];
  setTradeResults: (results: TradeResult[]) => void;
  applications: AcademyApplication[];
  setApplications: (apps: AcademyApplication[]) => void;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  onNavigate: (page: string) => void;
}

export default function AdminPortal({
  programs,
  setPrograms,
  testimonials,
  setTestimonials,
  tradeResults,
  setTradeResults,
  applications,
  setApplications,
  webhookUrl,
  setWebhookUrl,
  onNavigate
}: AdminPortalProps) {
  // Login credentials state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab State: 'overview' | 'applications' | 'curriculum' | 'trades' | 'testimonials' | 'settings'
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Webhook settings locally edited URL
  const [tempWebhookUrl, setTempWebhookUrl] = useState(webhookUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- CRUD Editing States ---
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [programForm, setProgramForm] = useState<Omit<Program, "id">>({
    name: "",
    tagline: "",
    price: 299,
    duration: "",
    description: "",
    features: [""]
  });

  const [editingTrade, setEditingTrade] = useState<TradeResult | null>(null);
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [tradeForm, setTradeForm] = useState<Omit<TradeResult, "id">>({
    pair: "",
    profit: 500,
    time: "Just now",
    type: "Verified Outcome",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbk9JQStyfDlCgVwcO-405y7XHIN5JJAvPh4qlenkF58YtsX8-YPF7glUjId70hZpPUEgoOsU3vZ_tq5S2L7oZ36svSI975T3ZDPcRkJICKHZvb4qicc6cgSp8wpBax4znKIwRetMwrZoOFEv4nnNI9zQA2o6G6SeC9iUsGiHMm6Q6HPaI7LajRoTasR5QQIB8zAkztYMKmcus_2nUtkxTq0Z4gp6pgYjSUHJ-bb_kjSjYE5OTmGnjOw"
  });

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Omit<Testimonial, "id">>({
    name: "",
    role: "Verified Student",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnbW28xe8TJetFpEMZvT3qghuTWJ0Kqy4cniK7KhtDX6hzz5jbtJb57FC7YDlhWZojz7C-FfFb6Y9mNy2C8w0uB2rVjGfk9KEZv15hXfeWfyr-HbfQo_cuskh447I4TEvTes7ldDndWMxlg3THoWi7NGstj01OIiJL74xWT8HYINtdFbDl5ZYEy7MeFNzhVuWiEHJAGmmaZvY0f4WnhH5QZyavtAE_S5-2Az2vfxMTOQFPXDyoAzWdLg",
    rating: 5,
    quote: ""
  });

  const [appFilter, setAppFilter] = useState<string>("All");

  // --- Auth Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Access Denied: Invalid security signature key coordinates.");
    }
  };

  const handleAutofill = () => {
    setUsername("admin");
    setPassword("admin");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // --- Application Actions ---
  const updateAppStatus = (id: string, status: AcademyApplication["status"]) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status } : app
    );
    setApplications(updated);
  };

  const deleteApplication = (id: string) => {
    if (confirm("Are you sure you want to delete this applicant's record?")) {
      setApplications(applications.filter(app => app.id !== id));
    }
  };

  const clearAllApplications = () => {
    if (confirm("🚨 WARNING: This will permanently purge all stored student enrollment applications. Continue?")) {
      setApplications([]);
    }
  };

  // --- Webhook URL Action ---
  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookUrl(tempWebhookUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // --- Program / Course Actions ---
  const handleAddFeatureField = () => {
    setProgramForm(prev => ({ ...prev, features: [...prev.features, ""] }));
  };

  const handleRemoveFeatureField = (idx: number) => {
    setProgramForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleFeatureChange = (idx: number, val: string) => {
    const newFeatures = [...programForm.features];
    newFeatures[idx] = val;
    setProgramForm(prev => ({ ...prev, features: newFeatures }));
  };

  const handleAddProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProgram: Program = {
      ...programForm,
      id: programForm.name.toLowerCase().replace(/\s+/g, "-"),
      features: programForm.features.filter(f => f.trim() !== "")
    };
    setPrograms([...programs, newProgram]);
    setIsAddingProgram(false);
    setProgramForm({
      name: "",
      tagline: "",
      price: 299,
      duration: "",
      description: "",
      features: [""]
    });
  };

  const handleEditProgramSelect = (prog: Program) => {
    setEditingProgram(prog);
    setProgramForm({
      name: prog.name,
      tagline: prog.tagline,
      price: prog.price,
      duration: prog.duration,
      description: prog.description,
      features: prog.features.length > 0 ? prog.features : [""]
    });
  };

  const handleEditProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    const updated: Program = {
      ...editingProgram,
      name: programForm.name,
      tagline: programForm.tagline,
      price: programForm.price,
      duration: programForm.duration,
      description: programForm.description,
      features: programForm.features.filter(f => f.trim() !== "")
    };
    setPrograms(programs.map(p => p.id === editingProgram.id ? updated : p));
    setEditingProgram(null);
    setProgramForm({
      name: "",
      tagline: "",
      price: 299,
      duration: "",
      description: "",
      features: [""]
    });
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm("Delete this course level? This will remove it from enrollment selection.")) {
      setPrograms(programs.filter(p => p.id !== id));
    }
  };

  // --- Trade Outcome Actions ---
  const handleAddTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade: TradeResult = {
      ...tradeForm,
      id: `trade-${Date.now()}`
    };
    setTradeResults([newTrade, ...tradeResults]);
    setIsAddingTrade(false);
    setTradeForm({
      pair: "",
      profit: 500,
      time: "Just now",
      type: "Verified Outcome",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbk9JQStyfDlCgVwcO-405y7XHIN5JJAvPh4qlenkF58YtsX8-YPF7glUjId70hZpPUEgoOsU3vZ_tq5S2L7oZ36svSI975T3ZDPcRkJICKHZvb4qicc6cgSp8wpBax4znKIwRetMwrZoOFEv4nnNI9zQA2o6G6SeC9iUsGiHMm6Q6HPaI7LajRoTasR5QQIB8zAkztYMKmcus_2nUtkxTq0Z4gp6pgYjSUHJ-bb_kjSjYE5OTmGnjOw"
    });
  };

  const handleEditTradeSelect = (trade: TradeResult) => {
    setEditingTrade(trade);
    setTradeForm({
      pair: trade.pair,
      profit: trade.profit,
      time: trade.time,
      type: trade.type,
      image: trade.image
    });
  };

  const handleEditTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrade) return;
    const updated: TradeResult = {
      ...editingTrade,
      pair: tradeForm.pair,
      profit: tradeForm.profit,
      time: tradeForm.time,
      type: tradeForm.type,
      image: tradeForm.image
    };
    setTradeResults(tradeResults.map(t => t.id === editingTrade.id ? updated : t));
    setEditingTrade(null);
  };

  const handleDeleteTrade = (id: string) => {
    if (confirm("Remove this trade outcome card?")) {
      setTradeResults(tradeResults.filter(t => t.id !== id));
    }
  };

  // --- Testimonial Actions ---
  const handleAddTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: Testimonial = {
      ...testimonialForm,
      id: `test-${Date.now()}`
    };
    setTestimonials([newTest, ...testimonials]);
    setIsAddingTestimonial(false);
    setTestimonialForm({
      name: "",
      role: "Verified Student",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnbW28xe8TJetFpEMZvT3qghuTWJ0Kqy4cniK7KhtDX6hzz5jbtJb57FC7YDlhWZojz7C-FfFb6Y9mNy2C8w0uB2rVjGfk9KEZv15hXfeWfyr-HbfQo_cuskh447I4TEvTes7ldDndWMxlg3THoWi7NGstj01OIiJL74xWT8HYINtdFbDl5ZYEy7MeFNzhVuWiEHJAGmmaZvY0f4WnhH5QZyavtAE_S5-2Az2vfxMTOQFPXDyoAzWdLg",
      rating: 5,
      quote: ""
    });
  };

  const handleEditTestimonialSelect = (test: Testimonial) => {
    setEditingTestimonial(test);
    setTestimonialForm({
      name: test.name,
      role: test.role,
      avatar: test.avatar,
      rating: test.rating,
      quote: test.quote
    });
  };

  const handleEditTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    const updated: Testimonial = {
      ...editingTestimonial,
      name: testimonialForm.name,
      role: testimonialForm.role,
      avatar: testimonialForm.avatar,
      rating: testimonialForm.rating,
      quote: testimonialForm.quote
    };
    setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? updated : t));
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm("Remove this student testimonial card?")) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const filteredApps = appFilter === "All" 
    ? applications 
    : applications.filter(app => app.status === appFilter);

  // --- AUTHORIZATION PANEL LAYOUT ---
  if (!isAuthenticated) {
    return (
      <div className="relative pt-24 min-h-screen bg-black text-white flex items-center justify-center p-4 select-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#e9c349]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-[#131313]/90 rounded-xl border border-white/5 p-8 backdrop-blur-xl relative z-10 shadow-2xl">
          <div className="text-center mb-6 space-y-2">
            <div className="w-12 h-12 bg-[#e9c349]/10 text-[#e9c349] rounded-full flex items-center justify-center mx-auto border border-[#e9c349]/20 shadow-md">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <span className="font-mono text-[9px] text-[#e9c349] tracking-widest uppercase block">
              ZonziFX Security Protocol
            </span>
            <h2 className="font-headline text-xl font-bold text-white">
              Terminal Authorization
            </h2>
            <p className="text-xs text-[#cfc4c5]/60 max-w-xs mx-auto">
              Access is restricted to verified administrative credentials only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[11px] font-mono leading-normal flex gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Secure operator handle"
                className="w-full bg-black border border-white/10 p-3 rounded text-white text-sm focus:border-[#e9c349] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Passcode Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black border border-white/10 p-3 rounded text-white text-sm focus:border-[#e9c349] focus:outline-none"
                required
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full gold-gradient text-black font-headline text-sm py-3.5 rounded font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#af8d11]/15 cursor-pointer uppercase tracking-wider"
              >
                Authenticate Session
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <button 
              onClick={handleAutofill}
              className="text-[10px] font-mono text-[#e9c349]/70 hover:text-[#e9c349] transition-colors border border-[#e9c349]/20 hover:border-[#e9c349]/50 px-3 py-1.5 rounded bg-white/5 active:scale-95 cursor-pointer"
            >
              💡 Quick Login (Auto-fill Demo)
            </button>
            <p className="text-[9px] text-[#cfc4c5]/40 mt-3">
              Default login keys: <code className="text-white select-all">admin</code> / <code className="text-white select-all">admin</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN PANEL CORE ---
  return (
    <div className="relative pt-20 min-h-screen bg-[#0c0c0c] text-white overflow-x-hidden selection:bg-[#e9c349]/30 pb-16 flex flex-col">
      {/* Admin Top Dashboard Status Bar */}
      <div className="bg-[#131313] border-b border-white/5 px-6 md:px-16 py-3 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SECURE TERM-01 ONLINE</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="text-[#cfc4c5]">
            DB Nodes: <span className="text-white font-semibold">Active (Sync to Client state)</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="text-[#cfc4c5]">
            Webhook Mode: <span className={webhookUrl ? "text-[#e9c349] font-bold" : "text-[#cfc4c5]/50"}>
              {webhookUrl ? "External Delivery Enabled" : "Local Database Storage Only"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate("landing")}
            className="text-xs text-[#cfc4c5] hover:text-white transition-colors cursor-pointer border border-white/10 px-3 py-1.5 rounded bg-white/5 active:scale-95 flex items-center gap-1.5"
          >
            Return to Homepage
          </button>
          <button 
            onClick={handleLogout}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer border border-rose-500/10 hover:border-rose-500/30 px-3 py-1.5 rounded bg-rose-500/5 active:scale-95 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Operator
          </button>
        </div>
      </div>

      <div className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-16 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#e9c349]/10 flex items-center justify-center border border-[#e9c349]/20 text-[#e9c349]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Operator Console</h4>
              <p className="text-[10px] text-[#cfc4c5]/60 font-mono">ID: SEC-ROOT-045A</p>
            </div>
          </div>

          <div className="glass-card rounded-xl border border-white/5 overflow-hidden flex flex-col font-headline text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`p-4 text-left border-b border-white/5 transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "overview" ? "bg-[#e9c349]/10 text-[#e9c349] border-l-2 border-l-[#e9c349]" : "text-[#cfc4c5] hover:bg-white/5"
              }`}
            >
              <span>Dashboard Overview</span>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`p-4 text-left border-b border-white/5 transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "applications" ? "bg-[#e9c349]/10 text-[#e9c349] border-l-2 border-l-[#e9c349]" : "text-[#cfc4c5] hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
                Join Inquiries 
                {applications.filter(a => a.status === "Pending").length > 0 && (
                  <span className="bg-[#e9c349] text-black font-bold text-[9px] px-1.5 py-0.5 rounded-full">
                    {applications.filter(a => a.status === "Pending").length}
                  </span>
                )}
              </span>
              <Users className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`p-4 text-left border-b border-white/5 transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "curriculum" ? "bg-[#e9c349]/10 text-[#e9c349] border-l-2 border-l-[#e9c349]" : "text-[#cfc4c5] hover:bg-white/5"
              }`}
            >
              <span>Manage Curriculum</span>
              <BookOpen className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() => setActiveTab("trades")}
              className={`p-4 text-left border-b border-white/5 transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "trades" ? "bg-[#e9c349]/10 text-[#e9c349] border-l-2 border-l-[#e9c349]" : "text-[#cfc4c5] hover:bg-white/5"
              }`}
            >
              <span>Verified Trade Outcomes</span>
              <TrendingUp className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() => setActiveTab("testimonials")}
              className={`p-4 text-left border-b border-white/5 transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "testimonials" ? "bg-[#e9c349]/10 text-[#e9c349] border-l-2 border-l-[#e9c349]" : "text-[#cfc4c5] hover:bg-white/5"
              }`}
            >
              <span>Student Testimonials</span>
              <MessageSquare className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`p-4 text-left transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "settings" ? "bg-[#e9c349]/10 text-[#e9c349] border-l-2 border-l-[#e9c349]" : "text-[#cfc4c5] hover:bg-white/5"
              }`}
            >
              <span>Form Delivery Settings</span>
              <Settings className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>

        {/* Right Tab Content Panel */}
        <div className="lg:col-span-9 glass-card p-6 md:p-8 rounded-xl border border-white/5 min-h-[500px]">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="font-headline text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-xs text-[#cfc4c5] leading-relaxed">
                  Real-time analytics and telemetry tracking core platform parameters. System updates instantly cascade onto user interfaces.
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 bg-black rounded border border-white/5 text-center">
                  <BookOpen className="w-5 h-5 text-[#e9c349] mx-auto mb-2" />
                  <span className="text-[10px] font-mono text-[#cfc4c5]/60 uppercase tracking-wider block">Active Courses</span>
                  <span className="text-2xl font-headline font-bold text-white">{programs.length}</span>
                </div>
                <div className="p-5 bg-black rounded border border-white/5 text-center">
                  <TrendingUp className="w-5 h-5 text-[#e9c349] mx-auto mb-2" />
                  <span className="text-[10px] font-mono text-[#cfc4c5]/60 uppercase tracking-wider block">Verified Trades</span>
                  <span className="text-2xl font-headline font-bold text-white">{tradeResults.length}</span>
                </div>
                <div className="p-5 bg-black rounded border border-white/5 text-center">
                  <MessageSquare className="w-5 h-5 text-[#e9c349] mx-auto mb-2" />
                  <span className="text-[10px] font-mono text-[#cfc4c5]/60 uppercase tracking-wider block">Testimonials</span>
                  <span className="text-2xl font-headline font-bold text-white">{testimonials.length}</span>
                </div>
                <div className="p-5 bg-black rounded border border-white/5 text-center">
                  <Users className="w-5 h-5 text-[#e9c349] mx-auto mb-2" />
                  <span className="text-[10px] font-mono text-[#cfc4c5]/60 uppercase tracking-wider block">Form Inquiries</span>
                  <span className="text-2xl font-headline font-bold text-white">{applications.length}</span>
                </div>
              </div>

              {/* System Info alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-5 bg-[#131313] border border-white/5 rounded-lg space-y-4">
                  <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#e9c349]">Recent Submissions</h3>
                  {applications.length === 0 ? (
                    <p className="text-xs text-[#cfc4c5]/60 font-mono py-4">No recent inquiries recorded.</p>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto font-sans">
                      {applications.slice(0, 4).map((app) => (
                        <div key={app.id} className="flex justify-between items-center text-xs p-2.5 bg-black/40 rounded border border-white/5">
                          <div>
                            <p className="font-bold text-white">{app.fullName}</p>
                            <p className="text-[9px] text-[#cfc4c5]/60 font-mono">{app.email}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                            app.status === "Pending" ? "bg-[#e9c349]/20 text-[#e9c349]" :
                            app.status === "Approved" ? "bg-emerald-500/20 text-emerald-400" :
                            app.status === "Contacted" ? "bg-blue-500/20 text-blue-400" :
                            "bg-rose-500/20 text-rose-400"
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5 bg-[#131313] border border-white/5 rounded-lg space-y-4">
                  <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-[#e9c349]">Administrative Operations</h3>
                  <div className="space-y-2 text-xs font-mono text-[#cfc4c5] leading-relaxed">
                    <p>✔️ All client revisions automatically cache in state.</p>
                    <p>✔️ Edit verified outcomes slider instantly from this terminal.</p>
                    <p>✔️ Update program duration tags or course module pricing instantly.</p>
                    <p>✔️ Connect Formspree to route applicant alerts to your email.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATIONS / FORM SUBMISSIONS */}
          {activeTab === "applications" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-white mb-2">Join Academy Inquiries</h2>
                  <p className="text-xs text-[#cfc4c5] leading-relaxed">
                    Details of members who completed the Join Academy forms. Click Approve to flag them or Contact to register call requests.
                  </p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <select 
                    value={appFilter} 
                    onChange={(e) => setAppFilter(e.target.value)}
                    className="bg-[#0e0e0e] border border-white/10 p-2 rounded text-xs text-white"
                  >
                    <option value="All">Filter: All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  
                  {applications.length > 0 && (
                    <button 
                      onClick={clearAllApplications}
                      className="bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 hover:text-white font-mono text-[10px] uppercase tracking-wider px-3.5 py-2 rounded transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                  )}
                </div>
              </div>

              {filteredApps.length === 0 ? (
                <div className="border border-dashed border-white/10 p-12 text-center rounded-xl">
                  <Users className="w-10 h-10 text-[#cfc4c5]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#cfc4c5]">No applications found matching filtering rules.</p>
                  <p className="text-xs text-[#cfc4c5]/60 mt-1">Submit inquiries through &quot;Join Academy&quot; screen to populate dashboard nodes.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-white/5 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-black font-mono text-[#cfc4c5]/70 border-b border-white/10">
                        <th className="p-4">Submission Date</th>
                        <th className="p-4">Applicant Detail</th>
                        <th className="p-4">Desired Level</th>
                        <th className="p-4">Risk Profile / Capital</th>
                        <th className="p-4">Status Node</th>
                        <th className="p-4 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-white/[0.02]">
                          <td className="p-4 font-mono text-[10px] text-[#cfc4c5]/70">
                            {app.submittedAt}
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-white text-sm">{app.fullName}</p>
                            <p className="text-[#cfc4c5]/60 text-[10px]">{app.email}</p>
                            <p className="text-[#cfc4c5]/60 text-[10px]">{app.phone}</p>
                          </td>
                          <td className="p-4">
                            <span className="font-headline font-semibold text-[#e9c349] text-xs">
                              {programs.find(p => p.id === app.programId)?.name || app.programId}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="text-white"><span className="text-white/40">Exp:</span> {app.experience}</p>
                            <p className="text-white font-mono"><span className="text-white/40">Cap:</span> {app.capital}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold ${
                              app.status === "Pending" ? "bg-[#e9c349]/20 text-[#e9c349]" :
                              app.status === "Approved" ? "bg-emerald-500/20 text-emerald-400" :
                              app.status === "Contacted" ? "bg-blue-500/20 text-blue-400" :
                              "bg-rose-500/20 text-rose-400"
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-y-1 sm:space-y-0 sm:space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => updateAppStatus(app.id, "Approved")}
                              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 rounded text-[9px] font-mono cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateAppStatus(app.id, "Contacted")}
                              className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 rounded text-[9px] font-mono cursor-pointer"
                            >
                              Contact
                            </button>
                            <button
                              onClick={() => updateAppStatus(app.id, "Rejected")}
                              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 rounded text-[9px] font-mono cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => deleteApplication(app.id)}
                              className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded text-[9px] cursor-pointer"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURRICULUM MANAGEMENT */}
          {activeTab === "curriculum" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-white mb-2">Curriculum Syllabus Levels</h2>
                  <p className="text-xs text-[#cfc4c5] leading-relaxed">
                    Update programs/courses and customize specific syllabi items displayed in the Landing accordion or Enrollment forms.
                  </p>
                </div>
                
                {!isAddingProgram && !editingProgram && (
                  <button
                    onClick={() => {
                      setIsAddingProgram(true);
                      setEditingProgram(null);
                    }}
                    className="gold-gradient text-black font-headline text-xs px-4 py-2.5 rounded font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Add Level
                  </button>
                )}
              </div>

              {/* Form to Add or Edit Program */}
              {(isAddingProgram || editingProgram) && (
                <form 
                  onSubmit={isAddingProgram ? handleAddProgramSubmit : handleEditProgramSubmit}
                  className="bg-black/60 p-6 rounded-xl border border-white/10 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="font-headline font-bold text-sm text-[#e9c349]">
                      {isAddingProgram ? "Create New Educational Level" : `Edit Curriculum: ${editingProgram?.name}`}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingProgram(false);
                        setEditingProgram(null);
                      }}
                      className="text-xs text-white/50 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Level Name</label>
                      <input 
                        type="text" 
                        value={programForm.name}
                        onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                        placeholder="e.g., Options Volatility Protocol" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Tagline / Subheader</label>
                      <input 
                        type="text" 
                        value={programForm.tagline}
                        onChange={(e) => setProgramForm({ ...programForm, tagline: e.target.value })}
                        placeholder="e.g., Dynamic Arbitrage & Options Structuring" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Tuition Price ($ USD)</label>
                      <input 
                        type="number" 
                        value={programForm.price}
                        onChange={(e) => setProgramForm({ ...programForm, price: parseInt(e.target.value) || 0 })}
                        placeholder="e.g., 599" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Duration</label>
                      <input 
                        type="text" 
                        value={programForm.duration}
                        onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                        placeholder="e.g., 6 Weeks or Ongoing" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Syllabus (Mock Document)</label>
                      <div className="w-full bg-[#0e0e0e] border border-white/10 p-2 rounded text-[#cfc4c5] text-xs flex justify-between items-center">
                        <span className="font-mono text-[10px] truncate">📄 Level_Syllabus_Package.pdf</span>
                        <span className="text-[9px] text-[#e9c349] font-bold">Uploaded</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Course Core Description</label>
                    <textarea 
                      value={programForm.description}
                      onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                      placeholder="Identify complex structural volatility anomalies and executing delta-neutral trades..."
                      className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs h-20 focus:border-[#e9c349] focus:outline-none resize-none"
                      required
                    />
                  </div>

                  {/* Dynamic Features List input */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">
                      Syllabus Modules / Key Features List
                    </label>
                    
                    <div className="space-y-2 font-sans">
                      {programForm.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex gap-2 items-center font-sans">
                          <input 
                            type="text" 
                            value={feature}
                            onChange={(e) => handleFeatureChange(fIdx, e.target.value)}
                            placeholder={`Module ${fIdx + 1}: Core topic outline`}
                            className="flex-grow bg-[#0e0e0e] border border-white/10 p-2 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                            required
                          />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveFeatureField(fIdx)}
                            className="bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 p-2 rounded cursor-pointer"
                            disabled={programForm.features.length === 1}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button 
                      type="button" 
                      onClick={handleAddFeatureField}
                      className="text-xs text-[#e9c349] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Syllabus Module Line
                    </button>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingProgram(false);
                        setEditingProgram(null);
                      }}
                      className="bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="gold-gradient text-black font-headline text-xs px-6 py-2 rounded font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Course Details
                    </button>
                  </div>
                </form>
              )}

              {/* Programs Listing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programs.map((prog, idx) => (
                  <div key={prog.id} className="p-5 bg-black/40 border border-white/5 rounded-lg flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-mono text-[#e9c349] font-bold">LEVEL 0{idx + 1}</span>
                          <h4 className="font-headline font-bold text-white text-sm mt-0.5">{prog.name}</h4>
                          <p className="text-[10px] text-[#cfc4c5]/60 italic">{prog.tagline}</p>
                        </div>
                        <span className="text-[#e9c349] font-mono text-xs font-bold">${prog.price}</span>
                      </div>
                      <p className="text-xs text-[#cfc4c5] line-clamp-3 leading-relaxed">{prog.description}</p>
                      
                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[9px] font-mono text-[#cfc4c5]/40 uppercase tracking-widest block mb-1">Outline:</span>
                        <ul className="text-[10px] text-[#cfc4c5]/75 space-y-1 font-sans">
                          {prog.features.slice(0, 3).map((feat, fIdx) => (
                            <li key={fIdx} className="truncate">• {feat}</li>
                          ))}
                          {prog.features.length > 3 && (
                            <li className="text-[9px] text-[#e9c349]/70 font-mono">+ {prog.features.length - 3} more modules</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-mono rounded text-[#cfc4c5]">
                        {prog.duration}
                      </span>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProgramSelect(prog)}
                          className="bg-[#e9c349]/10 hover:bg-[#e9c349]/20 border border-[#e9c349]/20 hover:border-[#e9c349]/40 text-[#e9c349] px-2.5 py-1 text-[10px] rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(prog.id)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-2.5 py-1 text-[10px] rounded flex items-center gap-1 cursor-pointer transition-colors"
                          disabled={programs.length === 1}
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED TRADE OUTCOMES */}
          {activeTab === "trades" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-white mb-2">Verified Trading Floor Outcomes</h2>
                  <p className="text-xs text-[#cfc4c5] leading-relaxed">
                    Upload/edit trade outcome cards displayed inside the Landing Page results slider. Verified outcomes support screenshot proofs.
                  </p>
                </div>
                
                {!isAddingTrade && !editingTrade && (
                  <button
                    onClick={() => {
                      setIsAddingTrade(true);
                      setEditingTrade(null);
                    }}
                    className="gold-gradient text-black font-headline text-xs px-4 py-2.5 rounded font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Add Outcome
                  </button>
                )}
              </div>

              {/* Form to Add or Edit Trade */}
              {(isAddingTrade || editingTrade) && (
                <form 
                  onSubmit={isAddingTrade ? handleAddTradeSubmit : handleEditTradeSubmit}
                  className="bg-black/60 p-6 rounded-xl border border-white/10 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="font-headline font-bold text-sm text-[#e9c349]">
                      {isAddingTrade ? "Add New Verified Trade Outcome" : `Edit Outcome ID: ${editingTrade?.id}`}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingTrade(false);
                        setEditingTrade(null);
                      }}
                      className="text-xs text-white/50 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Instrument Pair</label>
                      <input 
                        type="text" 
                        value={tradeForm.pair}
                        onChange={(e) => setTradeForm({ ...tradeForm, pair: e.target.value })}
                        placeholder="e.g., EUR/USD Scalp" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Profit Secured ($ USD)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={tradeForm.profit}
                        onChange={(e) => setTradeForm({ ...tradeForm, profit: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g., 1250.00" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Time Slot Label</label>
                      <input 
                        type="text" 
                        value={tradeForm.time}
                        onChange={(e) => setTradeForm({ ...tradeForm, time: e.target.value })}
                        placeholder="e.g., 2h ago" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Outcome Type</label>
                      <input 
                        type="text" 
                        value={tradeForm.type}
                        onChange={(e) => setTradeForm({ ...tradeForm, type: e.target.value })}
                        placeholder="e.g., Scalp, Swing, Intraday, Payout" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Chart Screenshot URL</label>
                      <select 
                        value={tradeForm.image}
                        onChange={(e) => setTradeForm({ ...tradeForm, image: e.target.value })}
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      >
                        <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuCbk9JQStyfDlCgVwcO-405y7XHIN5JJAvPh4qlenkF58YtsX8-YPF7glUjId70hZpPUEgoOsU3vZ_tq5S2L7oZ36svSI975T3ZDPcRkJICKHZvb4qicc6cgSp8wpBax4znKIwRetMwrZoOFEv4nnNI9zQA2o6G6SeC9iUsGiHMm6Q6HPaI7LajRoTasR5QQIB8zAkztYMKmcus_2nUtkxTq0Z4gp6pgYjSUHJ-bb_kjSjYE5OTmGnjOw">Chart Presets: Green (EUR/USD)</option>
                        <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuA8XHH6iXE5ctnnM_w_cD0dcI1atHx0SIDAyzsncYV9YjzEkTtpm2XmzKgxfjoXpoWqK0ifpv-mb5-xagTTEeI7snc5Sve7ud4uFTQz9Z9-pavl5fxI3bnWyhju0MGD8I1iCbp-ixyaJUmoQ2P8yQ0Vxjw8OnSolZQS8ce4xk4UHu_uAK8s4w-yuknj0hVL0X-hbslj5u1J6ezYoJwFDSJ--sO6t9qPfgrTZAyufVMFXnS8EhzCI0qxZw">Chart Presets: Gold (XAU/USD)</option>
                        <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuDVtgQdTlvS8HPSYRZ6UluO-G3rJ2XKXHZ2-bceIF1LQI4LuwRfoYYgbdHbV4opFtaNRKpJLKsdnjinqk5sVSDj-vm-_O9ASr2aliEZaXZh7ajFF_j9OhXl2D9apOvj92sV7PHAWip3K_30lcn8-72zp_-KAIpPZikiNo17psvjuL5g5uF7vfv9yNIvWuyIZfZfprbanIYnEJmY6eLaNqo-V9QywZ0HiAycIWs_Iu5sqFYPzXqr0dY1VA">Chart Presets: Volatility (GBP/JPY)</option>
                        <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuDa6fRO59gL41shX_SpzZjfZe0YZFC9LQUUsDKAJmpmgQp7UoI88lztxNC0zrh2tsBe1cD8mh1ObebMPgK1q_t9y9WyE2Ii4tixOU8R6xV55bqaK7G9xIiQL6gJ_ogJgspEJsDZ8_DAgD_E4IFeAnAPX8B_1xQZRWWHsQ2hlGqfaPd6yf6s6djNsgovjc-jDc6qMcaou3G9RUESZ34fY-SFYS8ReNhR8hUOznohTMz_-ctSI_NAB5h_3A">Chart Presets: Payout Proof</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingTrade(false);
                        setEditingTrade(null);
                      }}
                      className="bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="gold-gradient text-black font-headline text-xs px-6 py-2 rounded font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Outcome details
                    </button>
                  </div>
                </form>
              )}

              {/* Trade Results Listing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tradeResults.map((trade) => (
                  <div key={trade.id} className="bg-black/40 border border-white/5 rounded-lg overflow-hidden flex flex-col justify-between">
                    <div className="aspect-video bg-neutral-900 relative">
                      <img src={trade.image} alt={trade.pair} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="text-[9px] font-mono text-emerald-400 block uppercase font-bold tracking-wider">{trade.type}</span>
                        <span className="text-base font-bold text-white font-headline">
                          +${trade.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3.5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{trade.pair}</p>
                        <p className="text-[10px] text-[#cfc4c5]/60 font-mono">{trade.time}</p>
                      </div>
                      
                      <div className="flex gap-1.5 font-sans">
                        <button
                          onClick={() => handleEditTradeSelect(trade)}
                          className="bg-white/5 hover:bg-white/10 p-1.5 rounded cursor-pointer text-[#cfc4c5] hover:text-white"
                          title="Edit Outcome Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrade(trade.id)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded cursor-pointer text-rose-400"
                          title="Remove Outcome"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-white mb-2">Student Testimonials</h2>
                  <p className="text-xs text-[#cfc4c5] leading-relaxed">
                    Update student feedback, ratings, and avatars shown on the Landing page testimonials block.
                  </p>
                </div>
                
                {!isAddingTestimonial && !editingTestimonial && (
                  <button
                    onClick={() => {
                      setIsAddingTestimonial(true);
                      setEditingTestimonial(null);
                    }}
                    className="gold-gradient text-black font-headline text-xs px-4 py-2.5 rounded font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Add Testimonial
                  </button>
                )}
              </div>

              {/* Form to Add or Edit Testimonial */}
              {(isAddingTestimonial || editingTestimonial) && (
                <form 
                  onSubmit={isAddingTestimonial ? handleAddTestimonialSubmit : handleEditTestimonialSubmit}
                  className="bg-black/60 p-6 rounded-xl border border-white/10 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="font-headline font-bold text-sm text-[#e9c349]">
                      {isAddingTestimonial ? "Add Student Success Testimony" : `Edit Testimony: ${editingTestimonial?.name}`}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingTestimonial(false);
                        setEditingTestimonial(null);
                      }}
                      className="text-xs text-white/50 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Student Name</label>
                      <input 
                        type="text" 
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                        placeholder="e.g., James Carter" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Role / Title</label>
                      <input 
                        type="text" 
                        value={testimonialForm.role}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                        placeholder="e.g., Commodities Trader" 
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Rating (Stars)</label>
                      <select 
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) || 5 })}
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Avatar Image Presets</label>
                      <select 
                        value={testimonialForm.avatar}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                        className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#e9c349] focus:outline-none"
                        required
                      >
                        <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuDnbW28xe8TJetFpEMZvT3qghuTWJ0Kqy4cniK7KhtDX6hzz5jbtJb57FC7YDlhWZojz7C-FfFb6Y9mNy2C8w0uB2rVjGfk9KEZv15hXfeWfyr-HbfQo_cuskh447I4TEvTes7ldDndWMxlg3THoWi7NGstj01OIiJL74xWT8HYINtdFbDl5ZYEy7MeFNzhVuWiEHJAGmmaZvY0f4WnhH5QZyavtAE_S5-2Az2vfxMTOQFPXDyoAzWdLg">Student Presets: Marcus Chen</option>
                        <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuBl82bylqozM4wD6UL7XwUbavYNKiiEZUXR4AMqpkUMCgPKPsTjbrmX9ag7ZXnjTf02HXDZ2JUE4Mhl_Kj1reUB4kWYE9iOlvK44G9TPymw6oqKhY2VAby9z3o3TWG-GliKnUwD6AjK-ZMgsA3KZLgkIgvO1C8g_CCXxLqp7AeEcCem5B8nZfahOLnD5l2GeKHeU6sAulSzx3wnBtmKdoeCBYQRdSSpGPt2LvWqQ2zso_W7mZ6rsoLvTA">Student Presets: Sarah Jenkins</option>
                        <option value="https://lh3.googleusercontent.com/aida-public/AB6AXuAKOH1nZI8peUo1-6txz12axegiiqTT772y3XFpgUL-oKzmi1vRMquVeS0SjRw4YKGIx6Q7LATILEtJy-fb1BvaOFGdMiwJ1-hBgEPEy-yX55_TaDzjM--XP3Qj5HVmQkfRx20Eij6NNH7d2lU37ivjw3n3-LkDlyTo2TnO5wQ99CHVFhJskRUmmiO6Z3gAcVwmAcyFKkvM0mpiJmgnkBlFfkqeyj9o6zoPxEbTedEwQ-DFA_sfTBTOvQ">Student Presets: David Miller</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-[#cfc4c5]">Student Quote</label>
                    <textarea 
                      value={testimonialForm.quote}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                      placeholder="The training curriculum completely altered how I analyze daily liquidity swept zones..."
                      className="w-full bg-[#0e0e0e] border border-white/10 p-2.5 rounded text-white text-xs h-24 focus:border-[#e9c349] focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingTestimonial(false);
                        setEditingTestimonial(null);
                      }}
                      className="bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="gold-gradient text-black font-headline text-xs px-6 py-2 rounded font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Testimony
                    </button>
                  </div>
                </form>
              )}

              {/* Testimonials Listing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((test) => (
                  <div key={test.id} className="p-5 bg-black/40 border border-white/5 rounded-lg flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex gap-0.5">
                        {[...Array(test.rating)].map((_, i) => (
                          <span key={i} className="text-[#e9c349] text-xs">★</span>
                        ))}
                      </div>
                      
                      <p className="text-xs text-[#cfc4c5] italic leading-relaxed">
                        &quot;{test.quote}&quot;
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <img src={test.avatar} alt={test.name} className="w-8 h-8 rounded-full bg-neutral-800 object-cover animate-none" />
                        <div>
                          <h4 className="font-bold text-white text-xs">{test.name}</h4>
                          <p className="text-[9px] text-[#e9c349] font-mono uppercase tracking-wider">{test.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1.5 font-sans">
                        <button
                          onClick={() => handleEditTestimonialSelect(test)}
                          className="bg-white/5 hover:bg-white/10 p-1.5 rounded cursor-pointer text-[#cfc4c5] hover:text-white"
                          title="Edit Testimony"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(test.id)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 p-1.5 rounded cursor-pointer text-rose-400"
                          title="Remove Testimony"
                          disabled={testimonials.length === 1}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FORM ROUTING / WEBHOOK SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-headline text-2xl font-bold text-white mb-2">Form Delivery Integrations</h2>
                <p className="text-xs text-[#cfc4c5] leading-relaxed">
                  Connect your Join Academy forms to an external free service. Submissions will automatically send emails or register cells when completed.
                </p>
              </div>

              <form onSubmit={handleSaveWebhook} className="bg-black/60 p-6 rounded-xl border border-white/10 space-y-6">
                {saveSuccess && (
                  <div className="p-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Configuration successfully integrated and updated. All new submissions will sync here.</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#cfc4c5]">
                    External Forms Webhook Endpoint
                  </label>
                  <input 
                    type="url" 
                    value={tempWebhookUrl}
                    onChange={(e) => setTempWebhookUrl(e.target.value)}
                    placeholder="e.g., https://formspree.io/f/your_form_id" 
                    className="w-full bg-[#0e0e0e] border border-white/10 p-3.5 rounded text-white text-sm focus:border-[#e9c349] focus:outline-none font-mono"
                  />
                  <p className="text-[10px] text-[#cfc4c5]/50 leading-relaxed font-sans">
                    💡 **Compatible with:** Formspree, Make, Zapier, Google Sheets webhooks, Slack incoming webhooks, or any custom API that accepts JSON POST requests. Leave empty to use local database caching only.
                  </p>
                </div>

                <div className="p-4 bg-[#1b1b1b] rounded border border-white/5 space-y-3 text-xs">
                  <h4 className="font-headline font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#e9c349]" /> How to use free Formspree to collect emails:
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1 text-[#cfc4c5] font-sans">
                    <li>Create a free account on <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="text-[#e9c349] hover:underline">Formspree</a> or similar.</li>
                    <li>Create a new form and copy the endpoint URL (looks like `https://formspree.io/f/xkn...`).</li>
                    <li>Paste the URL in the input field above and click Save.</li>
                    <li>Now, whenever a user registers, their details will be sent straight to your email!</li>
                  </ol>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit" 
                    className="gold-gradient text-black font-headline text-sm px-8 py-3.5 rounded font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <Save className="w-4 h-4" /> Save Form Integration
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
