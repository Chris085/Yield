import { useAuth } from '../lib/auth-context';
import { ActionButton } from '../components/ui/ActionButton';

export function LoginView() {
  const { signIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] p-6 bg-black text-center relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl mix-blend-screen" />
      
      <div className="z-10 w-full max-w-sm flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-white text-black rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase">Yield.</h1>
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase">Systemic Output Tracker</p>
        </div>
        
        <div className="w-full mt-12">
          <ActionButton onClick={signIn} label="Authenticate" className="bg-white text-black hover:bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}
