'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Mail, CreditCard, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StandaloneBookingApp() {
    const [currentView, setCurrentView] = useState<'home' | 'book' | 'dashboard'>('home');

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Apple-Style Navigation */}
            <nav className="glass-nav fixed top-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentView('home')}
                        className="text-title-3 font-bold"
                    >
                        FPSOS Booking
                    </button>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setCurrentView('book')}
                            className="text-body text-white/60 hover:text-white transition-colors"
                        >
                            Book
                        </button>
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className="text-body text-white/60 hover:text-white transition-colors"
                        >
                            Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="pt-16">
                {currentView === 'home' && <HomeView onBook={() => setCurrentView('book')} />}
                {currentView === 'book' && <BookView />}
                {currentView === 'dashboard' && <DashboardView />}
            </div>
        </div>
    );
}

function HomeView({ onBook }: { onBook: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl text-center"
            >
                <h1 className="text-display-large mb-6">
                    Your Complete
                    <br />
                    <span className="text-gradient-blue">Booking System</span>
                </h1>
                <p className="text-title-3 text-white/60 mb-12 max-w-2xl mx-auto">
                    Professional appointment scheduling with automatic payment verification,
                    real-time availability, and seamless customer experience.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {[
                        { icon: Calendar, title: 'Real-Time Availability', desc: 'No double bookings' },
                        { icon: CreditCard, title: 'Auto Payment Verify', desc: 'PayPal integration' },
                        { icon: User, title: 'Customer Portal', desc: 'Self-service bookings' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 rounded-2xl"
                        >
                            <feature.icon className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
                            <h3 className="text-headline mb-2">{feature.title}</h3>
                            <p className="text-footnote text-white/40">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <button onClick={onBook} className="btn-primary text-headline">
                    Book a Session →
                </button>
            </motion.div>
        </div>
    );
}

function BookView() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 rounded-3xl max-w-2xl w-full"
            >
                <h2 className="text-title-1 mb-8 text-center">Book Your Session</h2>

                <div className="space-y-6">
                    {/* Package Selection */}
                    <div>
                        <label className="text-headline block mb-3">Select Package</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Quick Fix - AED 199', 'Full Tune - AED 399', 'Extreme - AED 699'].map((pkg, i) => (
                                <button key={i} className="btn-secondary py-4 text-center text-callout">
                                    {pkg.split(' - ')[0]}
                                    <br />
                                    <span className="text-footnote text-white/40">{pkg.split(' - ')[1]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-headline block mb-3">Date</label>
                            <button className="input-apple flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Select date</span>
                            </button>
                        </div>
                        <div>
                            <label className="text-headline block mb-3">Time</label>
                            <button className="input-apple flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Select time</span>
                            </button>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <label className="text-headline block mb-3">Your Details</label>
                        <div className="space-y-3">
                            <input type="text" placeholder="Full Name" className="input-apple" />
                            <input type="email" placeholder="Email" className="input-apple" />
                            <input type="text" placeholder="Discord ID" className="input-apple" />
                        </div>
                    </div>

                    <button className="btn-primary w-full py-4 text-headline">
                        Continue to Payment →
                    </button>
                </div>

                <p className="text-caption-1 text-white/30 text-center mt-6">
                    Secure payment via PayPal • Instant confirmation
                </p>
            </motion.div>
        </div>
    );
}

function DashboardView() {
    return (
        <div className="min-h-screen px-6 py-20">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-title-1 mb-12">Admin Dashboard</h1>

                    {/* Stats */}
                    <div className="grid md:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Revenue', value: 'AED 12,450', color: 'text-green-400' },
                            { label: 'Bookings', value: '42', color: 'text-blue-400' },
                            { label: 'Pending', value: '3', color: 'text-orange-400' },
                            { label: 'This Month', value: '+18%', color: 'text-cyan-400' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 rounded-2xl"
                            >
                                <p className="text-footnote text-white/40 mb-2">{stat.label}</p>
                                <p className={`text-title-2 font-bold ${stat.color}`}>{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Bookings */}
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-title-3">Recent Bookings</h2>
                        </div>
                        <div className="p-6">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-caption-1 font-bold">
                                            JD
                                        </div>
                                        <div>
                                            <p className="text-body font-semibold">John Doe</p>
                                            <p className="text-caption-1 text-white/40">Full System Tune-Up</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-callout text-green-400 font-mono">AED 399</p>
                                        <p className="text-caption-1 text-white/40">Jan 16, 2:00 PM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <a href="/admin/dashboard" className="btn-secondary">
                            Open Full Dashboard →
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
