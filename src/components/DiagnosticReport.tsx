interface ReportData {
    analysis_id: string;
    product_meta: {
        product_name: string;
        target_country: string;
        intended_use: string;
    };
    engine_result: {
        status: 'PASS' | 'CAUTION' | 'FAIL';
        classification?: string;
        rp_required?: boolean;
        rp_details?: string;
        risk_factors: Array<{
            module: string;
            severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
            description: string;
        }>;
    };
}

export function DiagnosticReport({ data, onReset }: { data: ReportData; onReset: () => void }) {
    const isCritical = data.engine_result.status === 'FAIL';
    const isWarning = data.engine_result.status === 'CAUTION';
    const statusColor = isCritical ? 'text-danger' : isWarning ? 'text-warning' : 'text-success';
    const statusBg = isCritical ? 'bg-danger/10 border-danger/20' : isWarning ? 'bg-warning/10 border-warning/20' : 'bg-success/10 border-success/20';
    const statusIcon = isCritical ? 'warning' : isWarning ? 'error' : 'check_circle';
    const statusLabel = isCritical ? 'Critical' : isWarning ? 'Caution' : 'Pass';

    return (
        <div className="relative flex min-h-[max(884px,100dvh)] w-full max-w-md mx-auto flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24 border-x border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <div onClick={onReset} className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined">arrow_back</span>
                </div>
                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight flex-1 text-center">Diagnostic Report</h2>
                <div className="flex w-10 items-center justify-end">
                    <button className="flex cursor-pointer items-center justify-center text-slate-900 dark:text-slate-100">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="flex flex-col p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 items-center text-center">
                <div className="relative mb-6">
                    {/* Status Circle */}
                    <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${statusBg}`}>
                        <span className={`material-symbols-outlined text-5xl ${statusColor}`}>{statusIcon}</span>
                    </div>
                    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg ${isCritical ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-success'}`}>
                        {statusLabel}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className={`${statusColor} text-2xl font-black leading-tight tracking-tight`}>
                        {isCritical ? 'Risk (Export Prohibited/Legal Risk)' : isWarning ? 'Caution (Compliance Needed)' : 'Safe for Export'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Final Judgment: {data.engine_result.status} Assessment</p>
                    <div className="mt-2 inline-flex items-center self-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono">
                        <span className="material-symbols-outlined text-sm">fingerprint</span>
                        Ref ID: {data.analysis_id}
                    </div>
                </div>
            </div>

            {/* Main Warning/Info Alert */}
            {data.engine_result.risk_factors.length > 0 && (
                <div className="px-6 py-8">
                    <div className={`p-4 rounded-xl border-l-4 ${isCritical ? 'border-danger bg-danger/5 dark:bg-danger/10' : 'border-warning bg-warning/5 dark:bg-warning/10'}`}>
                        <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-snug">
                            {isCritical ? 'Warning' : 'Notice'}: Found {data.engine_result.risk_factors.length} potential compliance issues for {data.product_meta.target_country}.
                        </h3>
                    </div>
                </div>
            )}

            {/* Product Meta Data */}
            <div className="px-6 space-y-4 mb-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-2">Analysis Context</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-slate-500">Product:</span>
                        <span className="font-semibold text-right">{data.product_meta.product_name}</span>
                        <span className="text-slate-500">Classification:</span>
                        <span className="font-semibold text-right">{data.engine_result.classification || 'N/A'}</span>
                        <span className="text-slate-500">RP Required:</span>
                        <span className="font-semibold text-right">{data.engine_result.rp_required ? 'Yes' : 'No'}</span>
                    </div>
                    {data.engine_result.rp_details && (
                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded">{data.engine_result.rp_details}</p>
                    )}
                </div>
            </div>

            {/* Risk Factors Details */}
            {data.engine_result.risk_factors.length > 0 && (
                <div className="px-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Detailed Risk Factors</h3>
                        <span className="text-xs font-semibold text-primary">{data.engine_result.risk_factors.length} issues</span>
                    </div>

                    {data.engine_result.risk_factors.map((risk, index) => (
                        <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${risk.severity === 'CRITICAL' || risk.severity === 'HIGH' ? 'bg-danger' : 'bg-warning'}`}>
                                    {risk.module}
                                </span>
                                <span className="material-symbols-outlined text-slate-400">info</span>
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                                {risk.severity === 'CRITICAL' ? 'Critical Rule Violation' : risk.severity === 'HIGH' ? 'High Risk Assessment' : 'Requirement Found'}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{risk.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* CTA Buttons */}
            <div className="px-6 py-12 flex flex-col gap-3 mt-auto">
                <button onClick={onReset} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span>
                    New Diagnosis
                </button>
                <button className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                    Download PDF Report
                </button>
            </div>
        </div >
    );
}
