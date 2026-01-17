'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Minimize2, Maximize2, Send, Upload, FileJson, ChevronRight, Zap, Play, Calendar } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// --- Types ---

type Message = {
    id: string
    type: 'bot' | 'user'
    content: React.ReactNode
    timestamp: Date
}

type QuickAction = {
    id: string
    label: string
    icon?: React.ReactNode
    onClick: () => void
    primary?: boolean
}

type AnalysisResult = {
    score: number
    criticalIssues: number
    warnings: number
    recommendation: string
    package: string
}

// --- Helper: Generate ID ---
const generateId = () => Math.random().toString(36).substring(2, 9)

// --- Helper: Analyze JSON ---
const analyzeJson = (data: any): AnalysisResult => {
    // Logic from PowerShell script's scoring, adapted
    let score = data.ImpactScore || 0
    const findings = data.Findings || []

    const critical = findings.filter((f: any) => f.Severity === 'Critical' || f.Severity === 'Fail').length
    const warnings = findings.filter((f: any) => f.Severity === 'Warning').length

    // Package Logic
    let recPackage = 'Quick Remote Fix'
    let recText = 'Standard optimization should suffice.'

    if (critical > 0 || score < 80) {
        recPackage = 'Full System Tune-Up'
        recText = 'Multiple critical issues detected. Full tune-up recommended.'
    }
    if (critical > 2 || score < 60) {
        recPackage = 'Extreme BIOSPRIME'
        recText = 'Deep system bottlenecks found. BIOSPRIME is required for stability.'
    }

    return {
        score,
        criticalIssues: critical,
        warnings,
        recommendation: recText,
        package: recPackage
    }
}

// --- Component ---

interface BotInterfaceProps {
    externalIsOpen?: boolean
    setExternalIsOpen?: (isOpen: boolean) => void
}

export default function BotInterface({ externalIsOpen, setExternalIsOpen }: BotInterfaceProps = {}) {
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    // Use external state if provided, otherwise internal
    const isControlled = externalIsOpen !== undefined && setExternalIsOpen !== undefined
    const isOpen = isControlled ? externalIsOpen : internalIsOpen
    const setIsOpen = isControlled ? setExternalIsOpen : setInternalIsOpen

    const [isTyping, setIsTyping] = useState(false)
    const [actions, setActions] = useState<QuickAction[]>([])
    const [dragActive, setDragActive] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // --- Auto-Scroll ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    // --- Initial Greeting ---
    useEffect(() => {
        if (messages.length === 0) {
            // Delay slightly for effect
            setTimeout(() => {
                addBotMessage(
                    <>
                        <p><strong>System Online.</strong> I am the FPSOS Diagnostic Agent.</p>
                        <p className="mt-2 text-sm text-gray-400">I can analyze your system deep-level or schedule your optimization.</p>
                    </>
                )
                setActions([
                    { id: 'quick', label: 'Quick Assessment', icon: <Zap size={14} />, onClick: startQuickScan },
                    { id: 'deep', label: 'Deep System Scan', icon: <FileJson size={14} />, onClick: startDeepScan, primary: true },
                    { id: 'book', label: 'Book Session', icon: <Calendar size={14} />, onClick: showBooking }
                ])
            }, 500)
        }
    }, [])

    // --- Message Handlers ---

    const addBotMessage = (content: React.ReactNode, delay = 500) => {
        setIsTyping(true)
        setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, { id: generateId(), type: 'bot', content, timestamp: new Date() }])
        }, delay)
    }

    const addUserMessage = (content: React.ReactNode) => {
        setMessages(prev => [...prev, { id: generateId(), type: 'user', content, timestamp: new Date() }])
    }

    // --- Flows ---

    const startQuickScan = () => {
        setActions([])
        addUserMessage("Run Quick Assessment")
        addBotMessage(
            <>
                <p>Let's do a quick check. What is your <strong>GPU Model</strong>?</p>
                <p className="text-xs text-gray-500 mt-1">e.g., RTX 3060, RX 580</p>
            </>
        )
        // Simplified for web demo - normally would be a form
        setActions([
            { id: 'nv', label: 'NVIDIA RTX 30/40 Series', onClick: () => handleQuickAnswer('High-End NVIDIA') },
            { id: 'nv-old', label: 'NVIDIA GTX / Older', onClick: () => handleQuickAnswer('Mid-Range NVIDIA') },
            { id: 'amd', label: 'AMD Radeon', onClick: () => handleQuickAnswer('AMD') },
            { id: 'idk', label: 'I don\'t know', onClick: () => handleQuickAnswer('Unknown') }
        ])
    }

    const handleQuickAnswer = (answer: string) => {
        setActions([])
        addUserMessage(answer)
        addBotMessage(
            <>
                <p>Understood. Do you experience <strong>input lag</strong> or <strong>stuttering</strong>?</p>
            </>
        )
        setActions([
            { id: 'yes-bad', label: 'Yes, it\'s unplayable', onClick: () => finishQuickScan('Severe') },
            { id: 'yes-mild', label: 'Sometimes / Mild', onClick: () => finishQuickScan('Mild') },
            { id: 'no', label: 'No, just want more FPS', onClick: () => finishQuickScan('None') }
        ])
    }

    const finishQuickScan = (issue: string) => {
        setActions([])
        addUserMessage(issue === 'Severe' ? 'It is unplayable' : issue === 'Mild' ? 'Occasional stutters' : 'Just need FPS')

        let pkg = 'Full System Tune-Up'
        if (issue === 'Severe') pkg = 'Extreme BIOSPRIME'
        if (issue === 'None') pkg = 'Quick Remote Fix'

        addBotMessage(
            <div className="space-y-2">
                <p>Based on your input, I recommend:</p>
                <div className="p-3 bg-purple-900/30 border border-purple-500/30 rounded">
                    <div className="text-purple-300 font-bold">{pkg}</div>
                    <div className="text-xs text-gray-400 mt-1">{issue === 'Severe' ? 'Fixes deep latency & hardware conflicts.' : 'Optimizes Windows & Drivers for max FPS.'}</div>
                </div>
                <p className="text-sm">Ready to proceed?</p>
            </div>
        )
        setActions([
            { id: 'book', label: 'Book Now', icon: <Calendar size={14} />, onClick: showBooking, primary: true },
            { id: 'restart', label: 'Start Over', onClick: startQuickScan }
        ])
    }

    const startDeepScan = () => {
        setActions([])
        addUserMessage("Start Deep System Scan")
        addBotMessage(
            <div className="space-y-3">
                <p><strong>Phase 1: Acquisition</strong></p>
                <p>To analyze your system (BIOS, Latency, Drivers), I need you to run my scanner tool.</p>
                <div className="p-3 bg-black/40 border border-gray-800 rounded text-sm">
                    <ol className="list-decimal list-inside space-y-1 text-gray-300">
                        <li>Download <a href="/FPSOS-CS2-Suite.ps1" className="text-blue-400 hover:underline font-mono">FPSOS-CS2-Suite.ps1</a></li>
                        <li>Right-click file → <em>Run with PowerShell</em></li>
                        <li>Wait ~10 seconds</li>
                        <li>Drag the generated <code className="text-orange-400">.json</code> report here</li>
                    </ol>
                </div>
            </div>
        )
        // No actions, waiting for file
    }

    const showBooking = () => {
        setActions([])
        addUserMessage("I want to book a session")
        addBotMessage(
            <div className="space-y-2">
                <p>Excellent choice. Here are the available packages:</p>
                <div className="grid gap-2">
                    <a href="/book?package=quick" target="_blank" className="block p-2 bg-gray-900/50 hover:bg-gray-800 border border-gray-700 hover:border-blue-500 rounded transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-blue-400 group-hover:text-blue-300">Quick Fix</span>
                            <span className="text-xs bg-blue-900/30 text-blue-300 px-1.5 py-0.5 rounded">$55</span>
                        </div>
                    </a>
                    <a href="/book?package=full" target="_blank" className="block p-2 bg-gray-900/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500 rounded transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-purple-400 group-hover:text-purple-300">Full Tune-Up</span>
                            <span className="text-xs bg-purple-900/30 text-purple-300 px-1.5 py-0.5 rounded">$110</span>
                        </div>
                    </a>
                    <a href="/book?package=extreme" target="_blank" className="block p-2 bg-gray-900/50 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 rounded transition-colors group">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-orange-400 group-hover:text-orange-300">BIOSPRIME</span>
                            <span className="text-xs bg-orange-900/30 text-orange-300 px-1.5 py-0.5 rounded">$190</span>
                        </div>
                    </a>
                </div>
            </div>
        )
        setActions([
            {
                id: 'restart', label: 'Back to Menu', onClick: () => {
                    setActions([
                        { id: 'quick', label: 'Quick Assessment', icon: <Zap size={14} />, onClick: startQuickScan },
                        { id: 'deep', label: 'Deep System Scan', icon: <FileJson size={14} />, onClick: startDeepScan, primary: true },
                        { id: 'book', label: 'Book Session', icon: <Calendar size={14} />, onClick: showBooking }
                    ])
                }
            }
        ])
    }

    // --- File Handling ---

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (file: File) => {
        if (!file.name.endsWith('.json')) {
            addBotMessage("⚠️ Invalid file type. Please upload the .json report generated by the PowerShell script.")
            return
        }

        addUserMessage(<div className="flex items-center gap-2"><FileJson size={16} /> {file.name}</div>)

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string)
                processReport(json)
            } catch (err) {
                addBotMessage("❌ Error parsing JSON. The file might be corrupted.")
            }
        }
        reader.readAsText(file)
    }

    const processReport = (data: any) => {
        const result = analyzeJson(data)

        addBotMessage(
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400 text-sm">ANALYSIS COMPLETE</span>
                    <span className={`font-mono font-bold text-xl ${result.score >= 80 ? 'text-green-500' : result.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>{result.score}/100</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-red-900/20 border border-red-900/50 p-2 rounded">
                        <div className="text-red-400 font-bold text-lg">{result.criticalIssues}</div>
                        <div className="text-gray-500">Critical</div>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-900/50 p-2 rounded">
                        <div className="text-yellow-400 font-bold text-lg">{result.warnings}</div>
                        <div className="text-gray-500">Warnings</div>
                    </div>
                </div>

                <div className="bg-gray-900/80 p-3 rounded border-l-2 border-blue-500 text-sm">
                    <p className="text-gray-300">{result.recommendation}</p>
                </div>

                <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">RECOMMENDED PACKAGE</p>
                    <div className="text-blue-400 font-bold text-lg">{result.package}</div>
                </div>
            </div>
            , 1500) // Longer delay to simulate processing

        setActions([
            { id: 'book', label: `Book ${result.package}`, icon: <Calendar size={14} />, onClick: showBooking, primary: true },
            { id: 'again', label: 'Scan Another', onClick: startDeepScan }
        ])
    }


    return (
        <>
            {/* Trigger Button (if closed) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[#00FFF0] to-[#008F98] text-black p-4 rounded-full shadow-[0_0_20px_rgba(0,255,240,0.5)] border border-white/20 transition-all hover:scale-110 active:scale-95 group"
                    >
                        <div className="relative">
                            <Zap className="w-6 h-6 fill-black" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#BFFF00]"></span>
                            </span>
                        </div>
                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 backdrop-blur text-xs rounded text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#00FFF0]/20">
                            System Diagnostic Online
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Main Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-[#020405]/95 backdrop-blur-xl border border-[#00FFF0]/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(0,255,240,0.1)] overflow-hidden font-sans"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#00FFF0]/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00FFF0] to-[#008F98] border border-white/20 flex items-center justify-center">
                                    <Zap size={16} className="text-black fill-black" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white leading-none">FPSOS Bot</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#BFFF00] animate-pulse shadow-[0_0_8px_#BFFF00]" />
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Quantum Linked</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Minimize2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#00FFF0]/20 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${msg.type === 'user'
                                            ? 'bg-gradient-to-br from-[#00FFF0] to-[#008F98] text-black font-medium rounded-tr-sm shadow-[0_0_15px_rgba(0,255,240,0.2)]'
                                            : 'bg-white/5 text-gray-100 rounded-tl-sm border border-white/10 backdrop-blur-sm'
                                        }`}>
                                        {msg.content}
                                        <div className={`text-[10px] mt-1 opacity-50 ${msg.type === 'user' ? 'text-black/70' : 'text-gray-500'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 rounded-2xl rounded-tl-sm p-3 border border-white/5 flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Actions / Input Area */}
                        <div
                            className={`p-4 border-t border-white/10 bg-white/5 transition-colors ${dragActive ? 'bg-blue-900/20 border-blue-500' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {/* Actions Grid */}
                            {actions.length > 0 && (
                                <div className="grid grid-cols-1 gap-2 mb-3">
                                    {actions.map(action => (
                                        <button
                                            key={action.id}
                                            onClick={action.onClick}
                                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${action.primary
                                                    ? 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/5'
                                                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                                }`}
                                        >
                                            {action.icon}
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input Bar (Visual only mostly, unless drag/drop) */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={dragActive ? "Drop JSON file here..." : "Select an option above..."}
                                    disabled
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none cursor-default"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                        title="Upload Diagnostic JSON"
                                    >
                                        <Upload size={16} />
                                    </button>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Drag Overlay */}
                        {dragActive && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-blue-500 z-50 pointer-events-none">
                                <FileJson size={48} className="text-blue-500 mb-2" />
                                <p className="text-blue-200 font-bold">Drop Diagnostic Report</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
