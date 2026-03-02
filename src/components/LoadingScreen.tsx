export function LoadingScreen() {
    return (
        <div className="relative flex h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark overflow-hidden border-x border-slate-200 dark:border-slate-800">
            {/* Top Navigation */}
            <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined">arrow_back</span>
                </div>
                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">AI Compliance Scan</h2>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center px-6 pt-10">
                {/* Product Preview / Scanner Visual */}
                <div className="w-full @container">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-primary/20">
                        {/* Placeholder for product being scanned */}
                        <div className="absolute inset-0 bg-center bg-no-repeat bg-cover" data-alt="Close up of organic food product packaging" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJAKXpJkcgcaLTB_j05lww3-YMeZFpZX6UMk61LHVNHUh9YSlDempBgdyj-g4wuRKguio9iA3o3iCm7gsFbQCnNYB_PyGt7nIqJl5qUk2gI2LRKZNcJnNcUHDvMyCZY5rkSjss_Iq7vYwDIfoBGZyEezlnbO4j96s7o-OG8dViTmy_eMqKbcZ0WNjY0pbb9NE9kWSBZVnOTCVtOG7DUpXJWl0ACNbbvbW9JGkTHjyMlnNfxAbaE-0YBpLgK9mvm7M3oMoV4v_4A8g")' }}>
                        </div>
                        {/* Scanner Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 flex flex-col justify-start">
                            <div className="w-full h-1 bg-primary shadow-[0_0_15px_rgba(36,99,235,0.8)] animate-pulse"></div>
                        </div>
                        {/* AI Recognition Boxes (Skeleton UI overlay) */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-16 border-2 border-white/60 rounded-lg flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white bg-primary px-1 rounded-sm uppercase tracking-widest">Label Detected</span>
                        </div>
                    </div>
                </div>

                {/* Analysis Header */}
                <div className="mt-8 text-center space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analyzing Your Product</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">SafePass AI is cross-referencing global trade data</p>
                </div>

                {/* Progress Section */}
                <div className="w-full mt-10 space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">Current Task</span>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Checking global SPS Sanitary conditions...</p>
                        </div>
                        <span className="text-lg font-bold text-primary">65%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-primary/10 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500 delay-100" style={{ width: '65%' }}></div>
                    </div>
                </div>

                {/* Status Logs / Activity Feed (Simulated text) */}
                <div className="w-full mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3">
                    <div className="flex items-center gap-3 opacity-100">
                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Cross-scanning ingredient origin regulations...</p>
                    </div>
                    <div className="flex items-center gap-3 opacity-60">
                        <div className="size-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Analyzing local Food & Drug admin classification...</p>
                    </div>
                    <div className="flex items-center gap-3 opacity-40">
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-sm">radio_button_unchecked</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Generating compliance report...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
