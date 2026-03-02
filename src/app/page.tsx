'use client';

import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { DiagnosticReport } from '@/components/DiagnosticReport';

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

export default function Home() {
  const [appState, setAppState] = useState<'input' | 'loading' | 'report'>('input');
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Form State
  const [targetCountry, setTargetCountry] = useState('');
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [ingredients, setIngredients] = useState([
    { name: '', percentage: '', origin: '', process: '' },
  ]);

  const handleAddIngredientRow = () => {
    setIngredients([...ingredients, { name: '', percentage: '', origin: '', process: '' }]);
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleDiagnose = async () => {
    setAppState('loading');

    // Filter out empty rows
    const validIngredients = ingredients
      .filter((i) => i.name.trim() !== '')
      .map((i) => ({
        name: i.name,
        origin: i.origin || 'Unknown',
        percentage: parseFloat(i.percentage) || 0,
      }));

    const payload = {
      product_name: productName,
      target_country: targetCountry,
      intended_use: purpose || category,
      ingredients: validIngredients,
    };

    try {
      const res = await fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setReportData(data);
      setAppState('report');
    } catch (error) {
      console.error('Diagnosis failed:', error);
      alert('진단 중 오류가 발생했습니다.');
      setAppState('input');
    }
  };

  if (appState === 'loading') {
    return <LoadingScreen />;
  }

  if (appState === 'report' && reportData) {
    return <DiagnosticReport data={reportData} onReset={() => setAppState('input')} />;
  }

  // --- Input Dashboard ---
  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-2xl">shield_person</span>
          <h1 className="text-xl font-bold tracking-tight">SafePass AI</h1>
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </nav>

      <main className="max-w-md mx-auto p-4 pb-24 space-y-6">
        {/* Header Section */}
        <div>
          <h2 className="text-2xl font-bold">New Diagnosis</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Fill in the product details to analyze export compliance risks.</p>
        </div>

        {/* Product Information Form */}
        <section className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">info</span>
            Product Information
          </h3>

          <div className="space-y-4">
            {/* Country Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Target Country</label>
              <div className="relative">
                <select
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option value="">Select destination...</option>
                  <option value="ID">Indonesia</option>
                  <option value="TH">Thailand</option>
                  <option value="US">USA</option>
                  <option value="VN">Vietnam</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Regulatory Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <option value="">Select category...</option>
                  <option value="food">Food & Beverage</option>
                  <option value="cosmetics">Cosmetics</option>
                  <option value="medical">Medical Device</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Product Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Product Name</label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                placeholder="e.g., Organic Glow Serum"
                type="text"
              />
            </div>

            {/* Main Purpose Radio */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Main Application/Purpose</label>
              <div className="grid grid-cols-1 gap-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                    name="purpose"
                    type="radio"
                    value="Ingestion"
                    checked={purpose === 'Ingestion'}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                  <span className="text-sm">Ingestion</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                    name="purpose"
                    type="radio"
                    value="Topical"
                    checked={purpose === 'Topical'}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                  <span className="text-sm">Topical Application</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* BOM Section */}
        <section className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">list_alt</span>
            Bill of Materials (BOM)
          </h3>

          <div className="relative py-2 flex items-center">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-widest">manual entry</span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          </div>

          {/* Manual Table Entry */}
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full min-w-[500px] text-sm text-left">
              <thead>
                <tr className="text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2 pr-2">Ingredient</th>
                  <th className="pb-2 px-2 w-20">Amount %</th>
                  <th className="pb-2 px-2">Origin</th>
                  <th className="pb-2 pl-2">Process</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {ingredients.map((ing, index) => (
                  <tr key={index}>
                    <td className="py-3 pr-2">
                      <input
                        value={ing.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm"
                        placeholder="Water"
                        type="text"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        value={ing.percentage}
                        onChange={(e) => updateIngredient(index, 'percentage', e.target.value)}
                        className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm"
                        placeholder="70"
                        type="text"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        value={ing.origin}
                        onChange={(e) => updateIngredient(index, 'origin', e.target.value)}
                        className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm"
                        placeholder="KR"
                        type="text"
                      />
                    </td>
                    <td className="py-3 pl-2">
                      <input
                        value={ing.process}
                        onChange={(e) => updateIngredient(index, 'process', e.target.value)}
                        className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm"
                        placeholder="Optional"
                        type="text"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleAddIngredientRow}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Ingredient Row
          </button>
        </section>

        {/* Final CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleDiagnose}
            disabled={!targetCountry || !productName}
            className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <span className="material-symbols-outlined">analytics</span>
            Diagnose Export Risk
          </button>
        </div>
      </main>
    </>
  );
}
