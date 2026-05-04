import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/auth-context';
import { ThickToggle } from '../components/ui/ThickToggle';
import { VisualSlider } from '../components/ui/VisualSlider';
import { MassiveNumberInput } from '../components/ui/MassiveNumberInput';
import { ActionButton } from '../components/ui/ActionButton';
import toast from 'react-hot-toast';

export function TelemetryView() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [wakingFriction, setWakingFriction] = useState(3);
  const [alcohol, setAlcohol] = useState(false);
  const [sugar, setSugar] = useState(false);
  const [sleepShort, setSleepShort] = useState(false);
  const [latency, setLatency] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!user) return;
    async function checkToday() {
      try {
        const docRef = doc(db, `users/${user!.uid}/daily_telemetry`, todayStr);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSubmitted(true);
        }
      } catch (e) {
        console.error("Failed to check telemetry status", e);
      }
    }
    checkToday();
  }, [user, todayStr]);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const docRef = doc(db, `users/${user.uid}/daily_telemetry`, todayStr);
      await setDoc(docRef, {
        userId: user.uid,
        date: serverTimestamp(),
        dateString: todayStr,
        wakingFriction,
        alcoholConsumed: alcohol,
        sugarMixers: sugar,
        sleepUnder6Hours: sleepShort,
        warmUpLatencyMins: latency === '' ? 0 : Number(latency),
        updatedAt: serverTimestamp()
      });
      
      toast.success('Telemetry Locked In', {
        style: {
          background: '#064e3b',
          color: '#34d399',
          fontWeight: 'bold',
        },
        iconTheme: {
          primary: '#34d399',
          secondary: '#064e3b',
        },
      });
      setSubmitted(true);
    } catch (error) {
      toast.error('Failed to save log');
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/daily_telemetry/${todayStr}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-black text-white">SYSTEM UPDATED</h2>
        <p className="text-zinc-400 text-lg">Morning telemetry recorded for {todayStr}.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 pb-32 animate-in fade-in duration-500">
      <div className="mb-4">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">Telemetry</h1>
        <p className="text-emerald-400 font-mono text-lg">{todayStr}</p>
      </div>

      <VisualSlider
        id="wakingFriction"
        label="Waking Friction"
        helpText="1 = Jumped out of bed, 5 = Crawled out"
        value={wakingFriction}
        onChange={setWakingFriction}
        min={1}
        max={5}
      />

      <div className="flex flex-col gap-4">
        <ThickToggle id="t-alcohol" label="Alcohol Consumed?" checked={alcohol} onChange={setAlcohol} />
        <ThickToggle id="t-sugar" label="Sugar / Mixers?" checked={sugar} onChange={setSugar} />
        <ThickToggle id="t-sleep" label="Sub-6hr Sleep?" checked={sleepShort} onChange={setSleepShort} />
      </div>

      <MassiveNumberInput
        id="latency"
        label="Warm-Up Latency"
        value={latency}
        onChange={setLatency}
        suffix="Mins"
      />

      <div className="pt-4">
        <ActionButton onClick={handleSubmit} loading={loading} label="Submit Telemetry" />
      </div>
    </div>
  );
}
