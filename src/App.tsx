/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import EnrollPage from "./components/EnrollPage";
import CheckoutPage from "./components/CheckoutPage";
import SuccessPage from "./components/SuccessPage";
import AdminPortal from "./components/AdminPortal";
import { EnrollmentData, Program, Testimonial, TradeResult, AcademyApplication } from "./types";
import { PROGRAMS, TESTIMONIALS, TRADE_RESULTS } from "./data";

interface PaymentReceipt {
  transactionId: string;
  programName: string;
  amountPaid: number;
  paymentMethod: string;
  promoCodeUsed: string;
}

export default function App() {

  // Navigation states: 'landing' | 'enroll' | 'checkout' | 'success' | 'admin'
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [selectedProgramId, setSelectedProgramId] = useState<string>("professional");
  
  // Persistent data state
  const [programs, setPrograms] = useState<Program[]>(() => {
    const saved = localStorage.getItem("zf_programs");
    return saved ? JSON.parse(saved) : PROGRAMS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem("zf_testimonials");
    return saved ? JSON.parse(saved) : TESTIMONIALS;
  });

  const [tradeResults, setTradeResults] = useState<TradeResult[]>(() => {
    const saved = localStorage.getItem("zf_tradeResults");
    return saved ? JSON.parse(saved) : TRADE_RESULTS;
  });

  const [applications, setApplications] = useState<AcademyApplication[]>(() => {
    const saved = localStorage.getItem("zf_applications");
    return saved ? JSON.parse(saved) : [];
  });

  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem("zf_webhookUrl") || "";
  });

  // Keep state synced to localStorage
  useEffect(() => {
    localStorage.setItem("zf_programs", JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem("zf_testimonials", JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem("zf_tradeResults", JSON.stringify(tradeResults));
  }, [tradeResults]);

  useEffect(() => {
    localStorage.setItem("zf_applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("zf_webhookUrl", webhookUrl);
  }, [webhookUrl]);

  // Registration user state
  const [enrollment, setEnrollment] = useState<EnrollmentData>({
    fullName: "",
    email: "",
    phone: "",
    programId: "professional"
  });

  // Completed transaction receipt
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  // Smooth scroll to top on page switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleSelectProgram = (id: string) => {
    setSelectedProgramId(id);
  };

  const handleEnrollSubmit = (data: EnrollmentData) => {
    setEnrollment(data);
    setCurrentPage("checkout");
  };

  const handlePaymentSuccess = (paymentReceipt: PaymentReceipt) => {
    setReceipt(paymentReceipt);
    setCurrentPage("success");
  };

  const handleReset = () => {
    setEnrollment({
      fullName: "",
      email: "",
      phone: "",
      programId: "professional"
    });
    setReceipt(null);
    setSelectedProgramId("professional");
    setCurrentPage("landing");
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e2e2e2] flex flex-col font-sans selection:bg-[#e9c349]/30">
      {/* Global Navigation Header */}
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Screen Layout Container with Motion Transition Effects */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {currentPage === "landing" && (
              <LandingPage 
                onNavigate={setCurrentPage} 
                onSelectProgram={handleSelectProgram} 
                programs={programs}
                testimonials={testimonials}
                tradeResults={tradeResults}
              />
            )}

            {currentPage === "enroll" && (
              <EnrollPage 
                selectedProgramId={selectedProgramId} 
                onNavigate={setCurrentPage} 
                onSubmitEnrollment={handleEnrollSubmit} 
                programs={programs}
                webhookUrl={webhookUrl}
                applications={applications}
                setApplications={setApplications}
              />
            )}

            {currentPage === "checkout" && (
              <CheckoutPage 
                enrollmentData={enrollment} 
                onNavigate={setCurrentPage} 
                onPaymentSuccess={handlePaymentSuccess} 
                programs={programs}
              />
            )}

            {currentPage === "success" && receipt && (
              <SuccessPage 
                receipt={receipt} 
                onReset={handleReset} 
              />
            )}

            {currentPage === "admin" && (
              <AdminPortal
                programs={programs}
                setPrograms={setPrograms}
                testimonials={testimonials}
                setTestimonials={setTestimonials}
                tradeResults={tradeResults}
                setTradeResults={setTradeResults}
                applications={applications}
                setApplications={setApplications}
                webhookUrl={webhookUrl}
                setWebhookUrl={setWebhookUrl}
                onNavigate={setCurrentPage}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Footer */}
      {currentPage !== "success" && (
        <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 px-6 md:px-16 mt-auto">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="font-headline text-lg font-bold text-white tracking-tighter">
                  <span className="gold-text-gradient">ZonziFX</span> Academy
                </div>
                <p className="text-[#cfc4c5]/60 text-xs mt-1.5 max-w-sm">
                  Precision instruction and custom analytics for disciplined global currency market participants.
                </p>
              </div>
              <div className="flex gap-8 text-xs font-mono">
                <a href="#curriculum" className="text-[#cfc4c5]/60 hover:text-white transition-colors">Syllabus</a>
                <a href="#results" className="text-[#cfc4c5]/60 hover:text-white transition-colors">Verified Results</a>
                <a onClick={() => setCurrentPage("enroll")} className="text-[#cfc4c5]/60 hover:text-white transition-colors cursor-pointer">Register</a>
                <a onClick={() => setCurrentPage("admin")} className="text-[#cfc4c5]/60 hover:text-[#e9c349] transition-colors cursor-pointer font-bold">Admin Portal</a>
              </div>            </div>

            <div className="pt-8 border-t border-white/5 space-y-4">
              <p className="font-mono text-[10px] text-[#353535] leading-relaxed uppercase">
                RISK WARNING: Trading foreign exchange (Forex) on margin carries high risk, and may not be suitable for all traders. Leveraging creates additional risk exposure. Before deciding to trade foreign exchange, carefully consider investment targets, experience level, and risk appetite. Past results are not indicative of future performance.
              </p>
              <div className="flex flex-col sm:flex-row justify-between text-[11px] text-[#353535] gap-2">
                <span>© 2026 ZonziFX Academy. All institutional rights reserved.</span>
                <span>Protected by AES-256 secure cryptographic protocol headers.</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
