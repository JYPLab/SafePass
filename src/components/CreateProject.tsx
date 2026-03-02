'use client';

import React, { useState } from 'react';

export interface ProjectData {
    productName: string;
    targetMarket: string;
    category: string;
}

interface CreateProjectProps {
    onNext: (projectId: string, data: ProjectData) => void;
    onCancel: () => void;
}

export function CreateProject({ onNext, onCancel }: CreateProjectProps) {
    const [productName, setProductName] = useState('');
    const [targetMarket, setTargetMarket] = useState('');
    const [category, setCategory] = useState('skincare');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (!productName || !targetMarket) {
            alert('Please fill in required fields');
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName, targetMarket, category })
            });

            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            const { id } = await response.json();

            onNext(id, {
                productName,
                targetMarket,
                category,
            });
        } catch (error) {
            console.error('Failed to create project:', error);
            alert('Error creating project');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl border-x border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Top App Bar */}
            <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800">
                <div
                    onClick={onCancel}
                    className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer transition-opacity hover:opacity-70"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">New Project</h2>
                <button className="flex h-12 items-center justify-end px-2 transition-opacity hover:opacity-70" onClick={onCancel}>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-bold leading-normal tracking-[0.015em] shrink-0">Cancel</p>
                </button>
            </div>

            {/* Scrollable Content */}
            <main className="flex-1 flex flex-col px-4 pb-24 pt-4">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight pb-3">
                        Let's start your compliance check
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
                        Enter your product details to begin the safety screening process for FDA or CPNP approval.
                    </p>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-6">
                    {/* Product Name Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-900 dark:text-white text-base font-medium leading-normal">Product Name</label>
                        <input
                            className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#192633] placeholder:text-slate-400 dark:placeholder:text-slate-500 h-14 px-4 text-base font-normal transition-all"
                            placeholder="e.g., Vitamin C Serum"
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>

                    {/* Target Market Select */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-900 dark:text-white text-base font-medium leading-normal">Target Market</label>
                        <div className="relative">
                            <select
                                className="form-select flex w-full appearance-none min-w-0 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#192633] h-14 px-4 pr-10 text-base font-normal transition-all cursor-pointer"
                                value={targetMarket}
                                onChange={(e) => setTargetMarket(e.target.value)}
                            >
                                <option disabled value="">Select market regulatory body</option>
                                <option value="fda">USA - FDA (Food and Drug Administration)</option>
                                <option value="cpnp">EU - CPNP (Cosmetic Products Notification Portal)</option>
                                <option value="hc">Canada - Health Canada</option>
                                <option value="tga">Australia - TGA</option>
                                <option value="id">Indonesia - BPOM/BPJPH</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Category Grid */}
                    <div className="flex flex-col gap-3 pt-2">
                        <label className="text-slate-900 dark:text-white text-base font-medium leading-normal">Product Category</label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Category Item: Skincare */}
                            <label className="group cursor-pointer relative">
                                <input
                                    checked={category === 'skincare'}
                                    onChange={() => setCategory('skincare')}
                                    className="peer sr-only"
                                    name="category"
                                    type="radio"
                                />
                                <div className="flex flex-col items-start gap-3 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#192633] transition-all peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 hover:border-primary/50">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary">
                                        <span className="material-symbols-outlined">water_drop</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Skincare</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Creams, Serums</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-[20px] filled">check_circle</span>
                                </div>
                            </label>

                            {/* Category Item: Haircare */}
                            <label className="group cursor-pointer relative">
                                <input
                                    checked={category === 'haircare'}
                                    onChange={() => setCategory('haircare')}
                                    className="peer sr-only"
                                    name="category"
                                    type="radio"
                                />
                                <div className="flex flex-col items-start gap-3 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#192633] transition-all peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 hover:border-primary/50">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                        <span className="material-symbols-outlined">face_3</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Haircare</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Shampoos, Oils</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-[20px] filled">check_circle</span>
                                </div>
                            </label>

                            {/* Category Item: Makeup */}
                            <label className="group cursor-pointer relative">
                                <input
                                    checked={category === 'makeup'}
                                    onChange={() => setCategory('makeup')}
                                    className="peer sr-only"
                                    name="category"
                                    type="radio"
                                />
                                <div className="flex flex-col items-start gap-3 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#192633] transition-all peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 hover:border-primary/50">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                                        <span className="material-symbols-outlined">brush</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Makeup</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Foundations, Lip</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-[20px] filled">check_circle</span>
                                </div>
                            </label>

                            {/* Category Item: Supplements */}
                            <label className="group cursor-pointer relative">
                                <input
                                    checked={category === 'supplements'}
                                    onChange={() => setCategory('supplements')}
                                    className="peer sr-only"
                                    name="category"
                                    type="radio"
                                />
                                <div className="flex flex-col items-start gap-3 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#192633] transition-all peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 hover:border-primary/50">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined">medication</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Supplements</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vitamins, Pills</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-[20px] filled">check_circle</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40">
                <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
                >
                    {isSubmitting ? 'Creating...' : 'Next Step'}
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
