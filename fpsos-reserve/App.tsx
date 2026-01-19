
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Calendar from './components/Calendar';
import { AppView, Service, Booking } from './types';
import { SERVICES, Icons } from './constants';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.USER_SELECT_SERVICE);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' });
  const [isOwnerView, setIsOwnerView] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const availableSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'
  ];

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setView(AppView.USER_SELECT_DATE);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setView(AppView.USER_SELECT_TIME);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setView(AppView.USER_FORM);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      serviceId: selectedService?.id || '',
      date: selectedDate,
      startTime: selectedTime || '',
      customerName: formData.name,
      customerEmail: formData.email,
      notes: formData.notes,
      status: 'confirmed'
    };
    setBookings([...bookings, newBooking]);
    setView(AppView.USER_CONFIRMED);
  };

  const toggleView = () => {
    setIsOwnerView(!isOwnerView);
    setView(isOwnerView ? AppView.USER_SELECT_SERVICE : AppView.OWNER_DASHBOARD);
  };

  const fetchAiSuggestion = async () => {
    if (!formData.notes || !selectedService) return;
    setIsAiLoading(true);
    const suggestion = await geminiService.suggestBestTime({
      serviceName: selectedService.name,
      availableSlots: availableSlots,
      userNotes: formData.notes
    });
    setAiSuggestion(suggestion);
    setIsAiLoading(false);
  };

  const renderSidebar = () => {
    if (view === AppView.OWNER_DASHBOARD) return null;
    if (view === AppView.USER_CONFIRMED) return null;

    return (
      <div className="w-full md:w-80 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-8 flex flex-col">
        <div className="mb-10">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Service Context</p>
          <h3 className="text-xl font-bold text-white tracking-tight">Engineering</h3>
        </div>

        {selectedService && (
          <div className="mb-8 p-6 bg-zinc-900/50 rounded-2xl border border-white/5 neon-border">
            <h4 className="font-bold text-white mb-2">{selectedService.name}</h4>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
              <Icons.Clock />
              <span>{selectedService.duration} min duration</span>
            </div>
            {selectedService.price > 0 && (
              <div className="text-sm text-cyan-400 font-bold">
                ${selectedService.price}.00 <span className="text-[10px] text-zinc-600 font-normal">USD</span>
              </div>
            )}
          </div>
        )}

        {view !== AppView.USER_SELECT_SERVICE && (
          <div className="mt-auto pt-8">
            <button 
              onClick={() => {
                if (view === AppView.USER_SELECT_DATE) setView(AppView.USER_SELECT_SERVICE);
                if (view === AppView.USER_SELECT_TIME) setView(AppView.USER_SELECT_DATE);
                if (view === AppView.USER_FORM) setView(AppView.USER_SELECT_TIME);
              }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors apple-button"
            >
              <Icons.ChevronLeft />
              Step Back
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout 
      title="Reserve" 
      showOwnerToggle={toggleView} 
      isOwnerView={isOwnerView}
    >
      {renderSidebar()}
      
      <div className="flex-1 overflow-y-auto bg-zinc-900/10">
        {view === AppView.USER_SELECT_SERVICE && (
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-10 tracking-tight text-white">Select Module</h2>
            <div className="space-y-4">
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectService(s)}
                  className="w-full text-left p-8 rounded-3xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all group flex justify-between items-center bg-zinc-900/40 neon-border"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-1 tracking-tight">{s.name}</h3>
                    <p className="text-sm text-zinc-500 line-clamp-1 max-w-sm">{s.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-800/80 px-3 py-1.5 rounded-full text-zinc-300 flex items-center gap-2">
                        <Icons.Clock /> {s.duration} MIN
                      </span>
                      {s.price > 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-cyan-950/30 px-3 py-1.5 rounded-full text-cyan-400 border border-cyan-400/20">
                          ${s.price} USD
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-white/5 text-zinc-500 group-hover:text-white transition-colors">
                    <Icons.ChevronRight />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === AppView.USER_SELECT_DATE && (
          <div className="p-4 md:p-12">
             <h2 className="text-3xl font-bold mb-8 tracking-tight text-white px-2">Scheduling</h2>
             <Calendar selectedDate={selectedDate} onDateSelect={handleSelectDate} />
          </div>
        )}

        {view === AppView.USER_SELECT_TIME && (
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-white">Timeline</h2>
            <p className="text-sm text-zinc-500 mb-10 font-medium">Selected for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSlots.map(time => (
                <button
                  key={time}
                  onClick={() => handleSelectTime(time)}
                  className="p-6 rounded-2xl border border-white/5 hover:border-cyan-400/50 bg-zinc-900 shadow-xl text-sm font-bold tracking-tight text-zinc-300 hover:text-white transition-all apple-button text-center"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === AppView.USER_FORM && (
          <div className="p-8 md:p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-white text-center">Finalize Intel</h2>
            <p className="text-sm text-zinc-500 mb-10 text-center">{selectedTime} &bull; {selectedDate.toLocaleDateString()}</p>
            
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Operator Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 rounded-xl bg-black/40 border border-white/5 focus:border-cyan-400/50 outline-none transition-all text-white font-medium"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Communication Channel</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 rounded-xl bg-black/40 border border-white/5 focus:border-cyan-400/50 outline-none transition-all text-white font-medium"
                    placeholder="jane@fpsos.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                  Optimization Notes
                  <button 
                    type="button"
                    onClick={fetchAiSuggestion}
                    className="flex items-center gap-1.5 text-[9px] font-black bg-cyan-400 text-black px-3 py-1 rounded-full hover:bg-cyan-300 transition-colors uppercase tracking-[0.1em]"
                  >
                    <Icons.Sparkles /> AI Advisor
                  </button>
                </label>
                <textarea 
                  rows={4}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/5 focus:border-cyan-400/50 outline-none transition-all text-white font-medium resize-none"
                  placeholder="Tell us about your system latency goals..."
                />
              </div>

              {isAiLoading && <div className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase animate-pulse text-center italic">Consulting FPSOS AI Core...</div>}
              {aiSuggestion && (
                <div className="p-6 bg-cyan-950/20 rounded-2xl border border-cyan-400/20 text-xs text-cyan-100 leading-relaxed shadow-lg">
                  <span className="font-black text-cyan-400 flex items-center gap-2 mb-2 uppercase tracking-widest"><Icons.Sparkles /> Kernel Suggestion</span>
                  {aiSuggestion}
                </div>
              )}

              <button 
                type="submit"
                className="w-full p-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs apple-button mt-4 shadow-2xl shadow-white/5 hover:bg-cyan-400 transition-colors"
              >
                Execute Reservation
              </button>
            </form>
          </div>
        )}

        {view === AppView.USER_CONFIRMED && (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="mb-10 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,242,254,0.5)]">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter text-white">MISSION SUCCESS.</h2>
            <p className="text-zinc-500 max-w-sm mb-12 font-medium">Synchronization complete. Your technical briefing has been encrypted and scheduled.</p>
            
            <div className="w-full max-w-sm p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4 mb-12">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-zinc-600">Module</span>
                <span className="text-white">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-zinc-600">Execution</span>
                <span className="text-white">{selectedTime}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-zinc-600">Timeline</span>
                <span className="text-white">{selectedDate.toLocaleDateString()}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setFormData({ name: '', email: '', notes: '' });
                setSelectedService(null);
                setSelectedTime(null);
                setAiSuggestion('');
                setView(AppView.USER_SELECT_SERVICE);
              }}
              className="px-10 py-4 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white transition-all apple-button"
            >
              Return to Base
            </button>
          </div>
        )}

        {view === AppView.OWNER_DASHBOARD && (
          <div className="p-8 md:p-12 w-full">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Command Center</h2>
                <p className="text-sm font-medium text-zinc-500">Monitoring {bookings.length} active sessions</p>
              </div>
              <button className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-full transition-colors"><Icons.Settings /></button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {bookings.length === 0 ? (
                <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-black/20">
                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Awaiting client telemetry...</p>
                </div>
              ) : (
                bookings.map(b => (
                  <div key={b.id} className="p-8 bg-zinc-900/40 rounded-[32px] border border-white/5 flex items-center justify-between hover:border-cyan-400/20 transition-colors">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-white/5 text-white rounded-2xl flex items-center justify-center text-xl font-black border border-white/10">
                        {b.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">{b.customerName}</h4>
                        <p className="text-xs text-zinc-500 font-medium mb-3">{b.customerEmail}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-800 px-3 py-1.5 rounded-full text-zinc-300 flex items-center gap-2">
                            <Icons.Calendar /> {b.date.toLocaleDateString()}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-800 px-3 py-1.5 rounded-full text-zinc-300 flex items-center gap-2">
                            <Icons.Clock /> {b.startTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 bg-cyan-400/10 px-4 py-2 rounded-full border border-cyan-400/20">Active</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
