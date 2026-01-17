"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';

export default function BookingDrawer() {
  const searchParams = useSearchParams();
  const diagnosisId = searchParams.get('diagnosis_id');
  const [isOpen, setIsOpen] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState<any>(null);

  useEffect(() => {
    if (diagnosisId) {
      // Fetch diagnosis data to pre-fill context if needed, 
      // or just open the drawer immediately.
      setIsOpen(true);
      fetch(`/api/diagnosis/${diagnosisId}`)
        .then(res => res.json())
        .then(data => setDiagnosisData(data))
        .catch(err => console.error("Failed to fetch diagnosis", err));
    }
  }, [diagnosisId]);

  // Calendly URL with pre-fill params
  // Note: Replace 'your-calendly-link' with actual link
  const getCalendlyUrl = () => {
    const baseUrl = "https://calendly.com/fpsos-support/consultation"; // Placeholder
    let url = `${baseUrl}?background_color=050505&text_color=ffffff&primary_color=00f5ff`;
    
    if (diagnosisData) {
      // Pre-fill answers (requires knowing Calendly field names, using generic names here)
      // a1, a2 etc usually map to custom questions
      url += `&a1=${encodeURIComponent(diagnosisData.systemScore)}`; 
      url += `&a2=${encodeURIComponent(diagnosisData.id)}`;
    }
    return url;
  };

  return (
    <>
        {/* Trigger Button (if not opened via URL) */}
        {!isOpen && (
             <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-[#00F5FF] text-black font-bold py-3 px-6 rounded-full shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all flex items-center gap-2 animate-bounce"
            >
                <Calendar className="w-5 h-5" />
                <span>Book Optimization</span>
            </button>
        )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 z-[1000] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#050505]">
                <div>
                  <h2 className="text-xl font-bold text-white">Secure Your Slot</h2>
                  {diagnosisData && (
                     <p className="text-sm text-[#00F5FF] font-mono mt-1">
                        DIAGNOSIS ID: {diagnosisData.id} | SCORE: {diagnosisData.systemScore}
                     </p>
                  )}
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 w-full bg-[#050505] relative">
                 <iframe 
                    src={getCalendlyUrl()} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0"
                    title="Schedule Appointment"
                 ></iframe>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
