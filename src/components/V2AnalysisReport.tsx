'use client';

import React from 'react';

export interface IngredientResult {
    name: string;
    cas?: string;
    note?: string;
    allowed_limit?: number;
    detected?: number;
}

export interface V2ReportData {
    summary?: { score: number; issues_count: number; status: string };
    ingredients?: {
        prohibited?: IngredientResult[];
        restricted?: IngredientResult[];
        safe?: IngredientResult[];
    };
}

interface V2AnalysisReportProps {
    reportData: V2ReportData;
    onHome: () => void;
}

export function V2AnalysisReport({ reportData, onHome }: V2AnalysisReportProps) {

    // Provide robust fallbacks if reportData is missing or incomplete
    const summary = reportData?.summary || { score: 0, issues_count: 0, status: 'Unknown' };
    const prohibited = reportData?.ingredients?.prohibited || [];
    const restricted = reportData?.ingredients?.restricted || [];
    const safe = reportData?.ingredients?.safe || [];

    const hasCritical = prohibited.length > 0;
    const hasWarning = restricted.length > 0;

    const statusColor = hasCritical ? 'text-danger' :
        hasWarning ? 'text-warning' : 'text-success';

    const statusBg = hasCritical ? 'bg-danger/10' :
        hasWarning ? 'bg-warning/10' : 'bg-success/10';

    const statusIcon = hasCritical ? 'gpp_bad' :
        hasWarning ? 'warning' : 'verified_user';

    const totalIngredients = prohibited.length + restricted.length + safe.length || 1;

    return (
        <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl mx-auto font-display text-slate-900 dark:text-slate-100">

            {/* Header */}
            <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <button onClick={onHome} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">home</span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">Analysis Report</h1>
                </div>
                <button className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-primary">
                    <span className="material-symbols-outlined">share</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 pb-24 hide-scrollbar">

                {/* Summary Card */}
                <div className="mb-6 relative overflow-hidden rounded-xl bg-white dark:bg-[#1a2632] p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className={`material-symbols-outlined text-8xl ${statusColor}`}>{statusIcon}</span>
                    </div>

                    <div className="relative z-10">
                        <div className="mb-2 flex items-center gap-2">
                            <span className={`inline-flex h-2 w-2 rounded-full ${hasCritical ? 'bg-danger animate-pulse' : hasWarning ? 'bg-warning animate-pulse' : 'bg-success'}`}></span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Compliance Status</span>
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {summary.status || (hasCritical ? 'Requires Attention' : hasWarning ? 'Action Needed' : 'Safe to Export')}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Batch ID: #AI-{Math.floor(Math.random() * 1000)}</p>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Score</span>
                                <span className={`text-2xl font-bold ${statusColor}`}>{summary.score}/100</span>
                            </div>
                            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Issues</span>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{summary.issues_count}</span>
                            </div>
                            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Market</span>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white uppercase">US/EU</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar Visual */}
                    <div className="mt-6 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                        <div className="h-full bg-danger transition-all duration-1000" style={{ width: `${(prohibited.length / totalIngredients) * 100}%` }}></div>
                        <div className="h-full bg-warning transition-all duration-1000" style={{ width: `${(restricted.length / totalIngredients) * 100}%` }}></div>
                        <div className="h-full bg-success transition-all duration-1000" style={{ width: `${(safe.length / totalIngredients) * 100}%` }}></div>
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                        <span>Prohibited</span>
                        <span>Restricted</span>
                        <span>Safe</span>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    <button className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20">All Ingredients</button>
                    <button className="whitespace-nowrap rounded-full bg-white dark:bg-[#1a2632] px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        Prohibited ({prohibited.length})
                    </button>
                    <button className="whitespace-nowrap rounded-full bg-white dark:bg-[#1a2632] px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        Restricted ({restricted.length})
                    </button>
                    <button className="whitespace-nowrap rounded-full bg-white dark:bg-[#1a2632] px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        Safe ({safe.length})
                    </button>
                </div>

                {/* List Section: Prohibited */}
                {prohibited.length > 0 && (
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Critical Issues</h3>
                        <div className="flex flex-col gap-3">
                            {prohibited.map((item: IngredientResult, i: number) => (
                                <div key={`proh-${i}`} className="group relative flex items-start gap-4 rounded-xl bg-white dark:bg-[#1a2632] p-4 shadow-sm border border-transparent hover:border-danger/30 transition-all">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
                                        <span className="material-symbols-outlined text-xl">block</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="truncate text-base font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                            <span className="shrink-0 rounded-md bg-danger/10 px-2 py-0.5 text-[10px] font-bold uppercase text-danger">Prohibited</span>
                                        </div>
                                        {item.cas && <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">CAS: {item.cas}</p>}
                                        <div className="rounded-lg bg-danger/5 p-2 text-xs text-danger">
                                            <span className="font-bold">Regulation:</span> {item.note}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* List Section: Restricted */}
                {restricted.length > 0 && (
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Warnings & Limits</h3>
                        <div className="flex flex-col gap-3">
                            {restricted.map((item: IngredientResult, i: number) => (
                                <div key={`rest-${i}`} className="group relative flex items-start gap-4 rounded-xl bg-white dark:bg-[#1a2632] p-4 shadow-sm border border-transparent hover:border-warning/30 transition-all">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
                                        <span className="material-symbols-outlined text-xl">warning</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="truncate text-base font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                            <span className="shrink-0 rounded-md bg-warning/10 px-2 py-0.5 text-[10px] font-bold uppercase text-warning">Restricted</span>
                                        </div>
                                        {item.cas && <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">CAS: {item.cas}</p>}
                                        {item.allowed_limit && (
                                            <div className="flex items-center justify-between gap-2 text-xs">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-400">Allowed Limit</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">{item.allowed_limit}%</span>
                                                </div>
                                                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-slate-400">Detected</span>
                                                    <span className={`font-bold ${(item.detected || 0) > (item.allowed_limit || 0) ? 'text-warning' : 'text-success'}`}>{item.detected || '?'}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* List Section: Safe */}
                {safe.length > 0 && (
                    <div className="mb-4">
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Safe Ingredients</h3>
                        <div className="flex flex-col gap-3">
                            {safe.map((item: any, i: number) => (
                                <div key={`safe-${i}`} className="group relative flex items-center gap-4 rounded-xl bg-white dark:bg-[#1a2632] p-4 shadow-sm border border-transparent opacity-80 hover:opacity-100 transition-all">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                                        <span className="material-symbols-outlined text-xl">check_circle</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="truncate text-base font-medium text-slate-900 dark:text-white">{item.name}</h4>
                                            <span className="shrink-0 rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase text-success">Safe</span>
                                        </div>
                                        {item.cas && <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">CAS: {item.cas}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="mt-6 flex justify-center">
                    <button className="w-full rounded-xl bg-primary hover:bg-blue-600 text-white font-bold py-4 shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">download</span>
                        Export Full PDF Report
                    </button>
                </div>
            </main>

            {/* Bottom Nav Bar */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2632] px-4 pb-6 pt-2">
                <div className="flex justify-between items-center">
                    <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors group" href="#">
                        <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform">
                            <span className="material-symbols-outlined text-2xl">document_scanner</span>
                        </div>
                        <p className="text-[10px] font-medium leading-normal tracking-[0.015em]">Scan</p>
                    </a>
                    <a className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" href="#">
                        <div className="flex h-8 items-center justify-center">
                            <span className="material-symbols-outlined text-2xl fill-current">assessment</span>
                        </div>
                        <p className="text-[10px] font-medium leading-normal tracking-[0.015em]">Reports</p>
                    </a>
                    <div className="relative -top-8 flex flex-col items-center justify-center">
                        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </button>
                    </div>
                    <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors group" href="#">
                        <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform">
                            <span className="material-symbols-outlined text-2xl">science</span>
                        </div>
                        <p className="text-[10px] font-medium leading-normal tracking-[0.015em]">Formulas</p>
                    </a>
                    <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors group" href="#">
                        <div className="flex h-8 items-center justify-center group-hover:-translate-y-1 transition-transform">
                            <span className="material-symbols-outlined text-2xl">settings</span>
                        </div>
                        <p className="text-[10px] font-medium leading-normal tracking-[0.015em]">Settings</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
