'use client';

import React from 'react';
import { useTuner } from '@/context/TunerContext';
import { X, RefreshCcw, Save, Cloud, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StyleTuner() {
    const { values, setValue, resetValues, isEnabled, toggleTuner, saveToCloud, loadFromCloud } = useTuner();
    const [isLocalhost, setIsLocalhost] = React.useState(false);

    React.useEffect(() => {
        setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }, []);

    if (!isEnabled || !isLocalhost) return null;

    const exportValues = () => {
        console.log(JSON.stringify(values, null, 2));
        alert('Values exported to console! Copy them to TunerContext.tsx to persist.');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="fixed right-4 top-4 bottom-4 w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 z-[100] overflow-y-auto p-6 shadow-2xl rounded-l-2xl scrollbar-thin scrollbar-thumb-cyan-500/20"
            >
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-black/90 p-2 -m-2 backdrop-blur-xl z-10 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white font-rajdhani uppercase tracking-wider">Style Tuner</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={exportValues} className="p-2 hover:bg-white/10 rounded-full text-green-400" title="Export to Console">
                            <Save size={18} />
                        </button>
                        <button onClick={resetValues} className="p-2 hover:bg-white/10 rounded-full text-yellow-400" title="Reset All">
                            <RefreshCcw size={18} />
                        </button>
                        <button onClick={() => saveToCloud(prompt("Preset Name:") || "My Preset")} className="p-2 hover:bg-white/10 rounded-full text-blue-400" title="Save to Cloud">
                            <Cloud size={18} />
                        </button>
                        <button onClick={loadFromCloud} className="p-2 hover:bg-white/10 rounded-full text-purple-400" title="Load from Cloud">
                            <Download size={18} />
                        </button>
                        <button onClick={toggleTuner} className="p-2 hover:bg-white/10 rounded-full text-red-400" title="Close (Shift+D)">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* PAGE LAYOUT */}
                    <ControlGroup title="Page Layout">
                        <Slider label="Hero Min Height (vh)" value={values.heroMinHeightVh} min={30} max={100} onChange={(v) => setValue('heroMinHeightVh', v)} />
                        <Slider label="Content Overlap (px)" value={values.mainContentOverlap} min={-500} max={100} onChange={(v) => setValue('mainContentOverlap', v)} />
                        <Slider label="Engineering Grid Padding Top" value={values.bentoGridPaddingTop} min={-200} max={300} onChange={(v) => setValue('bentoGridPaddingTop', v)} />
                    </ControlGroup>

                    {/* HERO SECTION */}
                    <ControlGroup title="Hero Layout">
                        <Slider label="Aspect Ratio (Height/Width)" value={values.heroAspectDenom} min={4} max={12} step={0.1} onChange={(v) => setValue('heroAspectDenom', v)} />
                        <Slider label="Top Margin" value={values.heroTopMargin} min={-2000} max={2000} onChange={(v) => setValue('heroTopMargin', v)} />
                        <Slider label="Text Vertical Pos" value={values.heroTextVerticalPos} min={-2000} max={2000} onChange={(v) => setValue('heroTextVerticalPos', v)} />
                        <Slider label="Text X Offset" value={values.heroTextTranslateX} min={-2000} max={2000} step={0.5} onChange={(v) => setValue('heroTextTranslateX', v)} />
                    </ControlGroup>

                    {/* GUARDIANS */}
                    <ControlGroup title="Guardians">
                        <Slider label="Gap Width" value={values.guardianGap} min={-2000} max={2000} onChange={(v) => setValue('guardianGap', v)} />
                        <Slider label="Scale %" value={values.guardianScale} min={50} max={150} onChange={(v) => setValue('guardianScale', v)} />
                        <Slider label="Y Offset" value={values.guardianOffsetY} min={-2000} max={2000} onChange={(v) => setValue('guardianOffsetY', v)} />
                        <Slider label="Left X Offset" value={values.leftGuardianOffsetX} min={-2000} max={2000} onChange={(v) => setValue('leftGuardianOffsetX', v)} />
                        <Slider label="Right X Offset" value={values.rightGuardianOffsetX} min={-2000} max={2000} onChange={(v) => setValue('rightGuardianOffsetX', v)} />
                        <Slider label="Guardian Opacity" value={values.guardianOpacity} min={0} max={1} step={0.01} onChange={(v) => setValue('guardianOpacity', v)} />
                    </ControlGroup>

                    {/* FEATURES SECTION */}
                    <ControlGroup title="Features Section">
                        <Slider label="Shade Top Margin" value={values.featureShadeMarginTop} min={-2000} max={2000} onChange={(v) => setValue('featureShadeMarginTop', v)} />
                        <Slider label="Seam Position Y" value={values.seamPositionY} min={-500} max={500} onChange={(v) => setValue('seamPositionY', v)} />
                        <Slider label="Shade Opacity" value={values.featureShadeOpacity} min={0} max={1} step={0.01} onChange={(v) => setValue('featureShadeOpacity', v)} />
                        <Slider label="Card Background Opacity" value={values.featureCardBgOpacity} min={0} max={1} step={0.01} onChange={(v) => setValue('featureCardBgOpacity', v)} />
                        <Slider label="Card Shadow Opacity" value={values.featureCardShadowOpacity} min={0} max={1} step={0.01} onChange={(v) => setValue('featureCardShadowOpacity', v)} />
                        <Slider label="Top Padding" value={values.featurePaddingTop} min={0} max={200} onChange={(v) => setValue('featurePaddingTop', v)} />
                        <Slider label="Bottom Spacing (Margin)" value={values.featurePaddingBottom} min={-500} max={300} onChange={(v) => setValue('featurePaddingBottom', v)} />
                    </ControlGroup>

                    {/* SYSTEM CAPABILITIES SECTION */}
                    <ControlGroup title="System Capabilities">
                        <Slider label="Title Top Margin" value={values.systemCapTitleMarginTop} min={0} max={150} onChange={(v) => setValue('systemCapTitleMarginTop', v)} />
                        <Slider label="Title Bottom Margin" value={values.systemCapTitleMarginBottom} min={0} max={150} onChange={(v) => setValue('systemCapTitleMarginBottom', v)} />
                        <Slider label="Title Font Size" value={values.systemCapTitleSize} min={16} max={48} onChange={(v) => setValue('systemCapTitleSize', v)} />
                        <Slider label="Card Gap" value={values.systemCapCardGap} min={8} max={64} onChange={(v) => setValue('systemCapCardGap', v)} />
                    </ControlGroup>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}

function ControlGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-4 border-b border-white/5 pb-6 last:border-0">
            <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4">{title}</h3>
            {children}
        </div>
    );
}

function Slider({ label, value, min, max, step = 1, onChange }: { label: string, value: number, min: number, max: number, step?: number, onChange: (val: number) => void }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>{label}</span>
                <span className="text-white">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer hover:bg-white/20 transition-colors"
            />
        </div>
    );
}
