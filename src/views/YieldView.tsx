import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/auth-context';
import { VisualSlider } from '../components/ui/VisualSlider';
import { MassiveNumberInput } from '../components/ui/MassiveNumberInput';
import { ActionButton } from '../components/ui/ActionButton';
import toast from 'react-hot-toast';

export function YieldView() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [liftName, setLiftName] = useState('Bench Press');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRPE] = useState(8);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const lifts = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Pull-ups', 'Cleans'];

  useEffect(() => {
    if (!user) return;
    async function checkToday() {
      try {
        const docRef = doc(db, `users/${user!.uid}/performance_yield`, todayStr);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSubmitted(true);
        }
      } catch (e) {
        console.error("Failed to check yield status", e);
      }
    }
    checkToday();
  }, [user, todayStr]);

  const handleSubmit = async () => {
    if (!user) return;
    if (!weight || !reps) {
      toast.error('Enter weight and reps');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, `users/${user.uid}/performance_yield`, todayStr);
      await setDoc(docRef, {
        userId: user.uid,
        date: serverTimestamp(),
        dateString: todayStr,
        primaryLiftName: liftName,
        topWeight: Number(weight),
        topReps: Number(reps),
        perceivedExertionRPE: rpe,
        updatedAt: serverTimestamp()
      });
      
      toast.success('Yield Logged', {
        style: {
          background: '#0369a1',
          color: '#38bdf8',
          fontWeight: 'bold',
        },
        iconTheme: {
          primary: '#38bdf8',
          secondary: '#0369a1',
        },
      });
      setSubmitted(true);
    } catch (error) {
      toast.error('Failed to log yield');
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/performance_yield/${todayStr}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-sky-500/20 rounded-full flex items-center justify-center text-sky-400 border border-sky-500 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h2 className="text-3xl font-black text-white">YIELD RECORDED</h2>
        <p className="text-zinc-400 text-lg">Mechanical output logged for {todayStr}.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 pb-32 animate-in fade-in duration-500">
      <div className="mb-4">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">yield Input</h1>
        <p className="text-sky-400 font-mono text-lg">Mechanical Output // {todayStr}</p>
      </div>

      <div className="flex flex-col gap-3 p-6 bg-zinc-900 border-2 border-zinc-800 rounded-2xl focus-within:border-sky-500 transition-all">
        <label htmlFor="lift-select" className="text-xl font-bold text-zinc-400 focus-within:text-sky-400">
          Primary Lift
        </label>
        <select
          id="lift-select"
          value={liftName}
          onChange={(e) => setLiftName(e.target.value)}
          className="w-full bg-transparent text-3xl font-black text-white outline-none appearance-none cursor-pointer"
        >
          {lifts.map(l => (
            <option key={l} value={l} className="bg-zinc-900 text-lg font-sans">{l}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MassiveNumberInput
          id="topWeight"
          label="Top Weight"
          value={weight}
          onChange={setWeight}
          suffix="lbs"
        />
        <MassiveNumberInput
          id="topReps"
          label="Reps"
          value={reps}
          onChange={setReps}
          suffix="reps"
        />
      </div>

      <VisualSlider
        id="rpe"
        label="RPE"
        helpText="Rate of Perceived Exertion"
        value={rpe}
        onChange={setRPE}
        min={1}
        max={10}
        colors={{ active: 'bg-sky-500', thumb: 'bg-sky-400', text: 'text-sky-400' }}
      />

      <div className="pt-4">
        <ActionButton 
          onClick={handleSubmit} 
          loading={loading} 
          label="Log Yield" 
          className="bg-sky-500 text-black hover:bg-sky-400"
        />
      </div>
    </div>
  );
}
