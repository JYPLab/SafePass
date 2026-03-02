'use client';

import { useState } from 'react';
import { CreateProject, ProjectData } from '@/components/CreateProject';
import { InputIngredients } from '@/components/InputIngredients';
import { V2AnalysisReport, V2ReportData } from '@/components/V2AnalysisReport';
import { LoadingScreen } from '@/components/LoadingScreen';

type Step = 'CREATE' | 'INPUT' | 'ANALYZING' | 'REPORT';

export default function Home() {
  const [step, setStep] = useState<Step>('CREATE');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [reportData, setReportData] = useState<V2ReportData | null>(null);

  const handleProjectCreated = (id: string, data: ProjectData) => {
    setProjectId(id);
    setProjectData(data);
    setStep('INPUT');
  };

  const handleAnalyzeUpload = async (file?: File) => {
    // Show loading screen while "AI" processes the image
    setStep('ANALYZING');

    try {
      if (!projectId) throw new Error("Project ID is missing");
      if (!file) throw new Error("Please upload an image label");

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/projects/${projectId}/analyze-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Vision AI analysis failed');
      }

      setReportData(data.report);
      setStep('REPORT');
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image");
      setStep('INPUT');
    }
  };

  const resetFlow = () => {
    setProjectId(null);
    setProjectData(null);
    setReportData(null);
    setStep('CREATE');
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 font-display">
      {step === 'CREATE' && (
        <CreateProject
          onNext={handleProjectCreated}
          onCancel={() => { }}
        />
      )}

      {step === 'INPUT' && (
        <InputIngredients
          projectId={projectId}
          onBack={() => setStep('CREATE')}
          onAnalyze={handleAnalyzeUpload}
        />
      )}

      {step === 'ANALYZING' && (
        <div className="flex h-screen w-full items-center justify-center max-w-md mx-auto shadow-2xl bg-white dark:bg-[#101922] border-x border-slate-200 dark:border-slate-800">
          <LoadingScreen />
        </div>
      )}

      {step === 'REPORT' && reportData && (
        <V2AnalysisReport
          reportData={reportData}
          onHome={resetFlow}
        />
      )}
    </main>
  );
}
