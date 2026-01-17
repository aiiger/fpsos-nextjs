'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface TunerValues {
    heroTextTranslateX: number;
    heroTextVerticalPos: number;
    heroAspectDenom: number;
    heroTopMargin: number;
    featureTitleSize: number;
    featureShadeMarginTop: number;
    featureCardGap: number;
    featureShadeOpacity: number;
    featureCardBgOpacity: number;
    featureCardShadowOpacity: number;
    featurePaddingTop: number;
    featurePaddingBottom: number;
    featureShadeGradientStart: number;
    sectionOverlap: number;
    seamPositionY: number;
    seamPaddingY: number;
    guardianGap: number;
    guardianOffsetY: number;
    guardianScale: number;
    leftGuardianOffsetX: number;
    rightGuardianOffsetX: number;
    guardianOpacity: number;
    howItWorksMarginTop: number;
    howItWorksPaddingY: number;
    howItWorksTitleBottomMargin: number;
    howItWorksStepsY: number;
    howItWorksLineTop: number;
    howItWorksStepTitleGap: number;
    // New additions based on StyleTuner usage
    howItWorksStepDescGap: number;
    howItWorksIconSize: number;
    howItWorksFontSize: number;
    heroMinHeightVh: number;
    mainContentOverlap: number;
    bentoGridPaddingTop: number;
    systemCapTitleMarginTop: number;
    systemCapTitleMarginBottom: number;
    systemCapTitleSize: number;
    systemCapCardGap: number;
    forgeSectionPaddingTop: number;
}

interface TunerContextType {
    values: TunerValues;
    setValue: (key: keyof TunerValues, value: number) => void;
    resetValues: () => void;
    isEnabled: boolean;
    toggleTuner: () => void;
    saveToCloud: (name: string) => Promise<void>;
    loadFromCloud: () => Promise<void>;
}

const defaultValues: TunerValues = {
    heroTextTranslateX: 0,
    heroTextVerticalPos: 160,
    heroAspectDenom: 8.7,
    heroTopMargin: 41,
    featureTitleSize: 28,
    featureShadeMarginTop: 16,
    featureCardGap: 24,
    featureShadeOpacity: 1,
    featureCardBgOpacity: 0.8,
    featureCardShadowOpacity: 0.5,
    featurePaddingTop: 32,
    featurePaddingBottom: 0,
    featureShadeGradientStart: 5,
    sectionOverlap: -208,
    seamPositionY: -40,
    seamPaddingY: 56,
    guardianGap: 1200,
    guardianOffsetY: -68,
    guardianScale: 68,
    leftGuardianOffsetX: -240, // Brought in from -313
    rightGuardianOffsetX: 240, // Brought in from 327
    guardianOpacity: 0.7, // Increased for premium visibility
    howItWorksMarginTop: 0,
    howItWorksPaddingY: 0,
    howItWorksTitleBottomMargin: 68,
    howItWorksStepsY: 0,
    howItWorksLineTop: 48,
    howItWorksStepTitleGap: 24,
    howItWorksStepDescGap: 12,
    howItWorksIconSize: 48,
    howItWorksFontSize: 24,
    heroMinHeightVh: 70,
    mainContentOverlap: -300,
    bentoGridPaddingTop: -200,
    systemCapTitleMarginTop: 50,
    systemCapTitleMarginBottom: 40,
    systemCapTitleSize: 32,
    systemCapCardGap: 24,
    forgeSectionPaddingTop: 128,
};

const TunerContext = createContext<TunerContextType | undefined>(undefined);

export function useTuner() {
    const context = useContext(TunerContext);
    if (!context) {
        throw new Error('useTuner must be used within a TunerProvider');
    }
    return context;
}

export function StyleTunerProvider({ children }: { children: ReactNode }) {
    const [values, setValues] = useState<TunerValues>(defaultValues);
    const [isEnabled, setIsEnabled] = useState(true);

    const setValue = (key: keyof TunerValues, value: number) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const resetValues = () => setValues(defaultValues);
    const toggleTuner = () => setIsEnabled((prev) => !prev);

    const saveToCloud = async (name: string) => {
        const user = auth.currentUser;
        if (!user) {
            alert("Please login to save presets!");
            return;
        }
        try {
            await setDoc(doc(db, 'style_presets', user.uid), {
                ...values,
                _presetName: name,
                _updatedAt: serverTimestamp()
            });
            alert(`Preset "${name}" saved to cloud!`);
        } catch (e) {
            console.error(e);
            alert("Failed to save.");
        }
    };

    const loadFromCloud = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("Please login to load presets!");
            return;
        }
        try {
            const snap = await getDoc(doc(db, 'style_presets', user.uid));
            if (snap.exists()) {
                const data = snap.data();
                // Remove meta fields
                const { _presetName, _updatedAt, ...cleanValues } = data as any;
                setValues(prev => ({ ...prev, ...cleanValues }));
                alert(`Loaded preset "${data._presetName || 'User Preset'}"`);
            } else {
                alert("No saved preset found.");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to load.");
        }
    };

    // Keyboard shortcut to toggle (Shift + D) - DEVELOPMENT ONLY
    React.useEffect(() => {
        // Completely disable tuner in production
        if (process.env.NODE_ENV !== 'development') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.shiftKey && e.key.toLowerCase() === 'd') {
                toggleTuner();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <TunerContext.Provider value={{ values, setValue, resetValues, isEnabled, toggleTuner, saveToCloud, loadFromCloud }}>
            {children}
        </TunerContext.Provider >
    );
}


