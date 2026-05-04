import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth, AuthProvider } from './lib/auth-context';
import { LoginView } from './views/LoginView';
import { TelemetryView } from './views/TelemetryView';
import { YieldView } from './views/YieldView';
import { DashboardView } from './views/DashboardView';
import { Activity, Zap, BarChart2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'telemetry' | 'yield' | 'insights'>('telemetry');

  if (loading) {
    return (
      <div className="h-[100dvh] w-full bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="h-[100dvh] w-full bg-black text-white overflow-y-auto overflow-x-hidden relative">
      {/* Dynamic Background Accents based on Tab */}
      <div className={`fixed top-0 inset-x-0 h-64 blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000 ${
        activeTab === 'telemetry' ? 'bg-emerald-500' : 
        activeTab === 'yield' ? 'bg-sky-500' : 'bg-fuchsia-500'
      }`} />
      
      <main className="min-h-full w-full max-w-md mx-auto pt-10 pb-[100px] relative z-10 selection:bg-white/20">
        {activeTab === 'telemetry' && <TelemetryView />}
        {activeTab === 'yield' && <YieldView />}
        {activeTab === 'insights' && <DashboardView />}
      </main>

      {/* Massive Tab Bar for 5 AM fat-fingering */}
      <nav className="fixed bottom-0 inset-x-0 w-full bg-black/80 backdrop-blur-xl border-t-2 border-zinc-900 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex max-w-md mx-auto h-[90px]">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'telemetry' ? 'text-emerald-400 scale-110' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Activity className="w-8 h-8" strokeWidth={activeTab === 'telemetry' ? 3 : 2} />
            <span className="text-[10px] uppercase font-black tracking-widest">Input</span>
          </button>
          
          <button
            onClick={() => setActiveTab('yield')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'yield' ? 'text-sky-400 scale-110' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Zap className="w-8 h-8" strokeWidth={activeTab === 'yield' ? 3 : 2} />
            <span className="text-[10px] uppercase font-black tracking-widest">Yield</span>
          </button>
          
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'insights' ? 'text-fuchsia-400 scale-110' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <BarChart2 className="w-8 h-8" strokeWidth={activeTab === 'insights' ? 3 : 2} />
            <span className="text-[10px] uppercase font-black tracking-widest">Insights</span>
          </button>
        </div>
      </nav>

      <Toaster position="top-center" toastOptions={{ className: 'font-mono text-sm uppercase tracking-wider' }} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
