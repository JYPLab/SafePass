'use client';

import React, { useRef, useState } from 'react';

interface InputIngredientsProps {
    projectId: string | null;
    onBack: () => void;
    onAnalyze: (file?: File) => void;
}

export function InputIngredients({ projectId, onBack, onAnalyze }: InputIngredientsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleScanClick = () => {
        // Trigger hidden file input for camera/gallery
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsScanning(true);
            // Wait a slight moment for UI perception, then call analyze
            setTimeout(() => {
                onAnalyze(file);
            }, 500);
        }
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto shadow-2xl overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Hidden file input for camera integration */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="environment" // Suggests back camera on mobile
                className="hidden"
            />

            {/* Header */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <button onClick={onBack} disabled={isScanning} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Input Ingredients</h2>
                <div className="flex size-12 items-center justify-center">
                    <button className="text-slate-900 dark:text-white flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors size-10">
                        <span className="material-symbols-outlined text-2xl">help</span>
                    </button>
                </div>
            </div>

            {/* Main Content Scroll Area */}
            <div className="flex-1 overflow-y-auto pb-24">
                <div className="px-4 pt-6 pb-2">
                    <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight mb-2">Add product data</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                        Choose the most convenient way to check your formula for compliance.
                    </p>
                </div>

                {/* Main Action: Scan */}
                <div className="p-4">
                    <div
                        onClick={isScanning ? undefined : handleScanClick}
                        className={`relative flex flex-col items-center justify-center w-full h-80 rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300 ${isScanning ? 'opacity-70 pointer-events-none' : ''}`}
                    >
                        {/* Background Image with Overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/60 to-transparent flex items-center justify-center">
                            {isScanning && (
                                <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-white text-6xl animate-spin mb-4">progress_activity</span>
                                    <p className="text-white font-bold animate-pulse">Vision AI Scanning...</p>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center justify-end h-full w-full p-6 pb-8 text-center">
                            <div className="mb-4 p-4 bg-primary rounded-full shadow-lg shadow-primary/30 animate-pulse">
                                <span className="material-symbols-outlined text-white text-4xl">center_focus_weak</span>
                            </div>
                            <h3 className="text-white text-2xl font-bold mb-2">Scan Ingredient Label</h3>
                            <p className="text-slate-300 text-sm max-w-[240px]">Use your camera to instantly capture ingredient lists from packaging.</p>

                            <button className="mt-6 w-full max-w-xs bg-white text-primary hover:bg-slate-100 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">photo_camera</span>
                                Start Scanning
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 px-6 py-2">
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider">Or manual entry</span>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                </div>

                {/* Secondary Actions Grid */}
                <div className="grid grid-cols-1 gap-4 p-4">
                    <button className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all group text-left">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">table_view</span>
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-slate-900 dark:text-white font-bold text-base">Upload Excel / BOM</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm">Import bulk data from spreadsheet files</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                    </button>

                    <button className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all group text-left">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">content_paste</span>
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-slate-900 dark:text-white font-bold text-base">Paste Ingredients</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm">Copy and paste text directly</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex gap-2 border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-[#192633] px-4 pb-6 pt-2 absolute bottom-0 w-full z-20">
                <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-[#92adc9] hover:text-primary dark:hover:text-white transition-colors group" href="#">
                    <div className="flex h-8 items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">home</span>
                    </div>
                    <p className="text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
                </a>
                <a className="flex flex-1 flex-col items-center justify-end gap-1 text-primary dark:text-white" href="#">
                    <div className="flex h-8 items-center justify-center relative">
                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full"></div>
                        <span className="material-symbols-outlined text-2xl fill-current relative z-10">qr_code_scanner</span>
                    </div>
                    <p className="text-xs font-bold leading-normal tracking-[0.015em]">Scan</p>
                </a>
                <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-[#92adc9] hover:text-primary dark:hover:text-white transition-colors group" href="#">
                    <div className="flex h-8 items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">history</span>
                    </div>
                    <p className="text-xs font-medium leading-normal tracking-[0.015em]">History</p>
                </a>
                <a className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 dark:text-[#92adc9] hover:text-primary dark:hover:text-white transition-colors group" href="#">
                    <div className="flex h-8 items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">person</span>
                    </div>
                    <p className="text-xs font-medium leading-normal tracking-[0.015em]">Profile</p>
                </a>
            </div>
        </div>
    );
}
