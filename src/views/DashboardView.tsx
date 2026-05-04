import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/auth-context';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays } from 'date-fns';

interface DataPoint {
  date: string;
  wakingFriction: number;
  alcoholConsumed: number;
}

export function DashboardView() {
  const { user } = useAuth();
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const q = query(
          collection(db, `users/${user!.uid}/daily_telemetry`),
          orderBy('dateString', 'desc'),
          limit(7)
        );
        const snap = await getDocs(q);
        
        let fetchedData: DataPoint[] = [];
        snap.forEach(doc => {
          const d = doc.data();
          fetchedData.push({
            date: format(new Date(d.dateString), 'MMM dd'),
            wakingFriction: d.wakingFriction || 0,
            alcoholConsumed: d.alcoholConsumed ? 5 : 0 // Scale to 5 for visibility on same chart
          });
        });
        
        // Reverse to show chronological left-to-right
        setData(fetchedData.reverse());
      } catch (e) {
        console.error("Failed to fetch dashboard data");
        handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/daily_telemetry`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="flex h-full items-center justify-center pt-20"><div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Derive simple insight
  const alcoholDays = data.filter(d => d.alcoholConsumed > 0);
  const avgFrictionWithAlcohol = alcoholDays.reduce((sum, d) => sum + d.wakingFriction, 0) / (alcoholDays.length || 1);
  const avgFrictionWithout = data.filter(d => d.alcoholConsumed === 0).reduce((sum, d) => sum + d.wakingFriction, 0) / ((data.length - alcoholDays.length) || 1);
  const frictionDiff = avgFrictionWithAlcohol - avgFrictionWithout;

  const hasInsight = alcoholDays.length > 0 && frictionDiff > 0;

  return (
    <div className="flex flex-col gap-6 p-4 pb-32 animate-in fade-in duration-500">
      <div className="mb-2">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">AI Insights</h1>
        <p className="text-fuchsia-400 font-mono text-lg">System Performance</p>
      </div>

      <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider string">System Status</h3>
        
        {hasInsight ? (
          <div className="bg-rose-900/40 border border-rose-500/50 p-4 rounded-xl">
            <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Alert: Disruption Detected
            </h4>
            <p className="text-zinc-300 font-medium">
              Logging Alcohol correlates with a <strong className="text-white">+{frictionDiff.toFixed(1)}</strong> increase in Waking Friction. System performance is degraded.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-900/40 border border-emerald-500/50 p-4 rounded-xl">
            <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Standard Operating Procedure
            </h4>
            <p className="text-zinc-300 font-medium">
              System running optimally. No significant disruptions detected in the recent telemetry window.
            </p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Correlation Matrix</h3>
        <p className="text-sm font-mono text-zinc-500 mb-6 uppercase tracking-widest pl-2 border-l-2 border-fuchsia-500">Waking Friction vs Alcohol</p>
        
        <div className="h-64 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="wakingFriction" 
                  stroke="#d946ef" 
                  strokeWidth={4} 
                  name="Waking Friction"
                  dot={{ fill: '#18181b', stroke: '#d946ef', strokeWidth: 3, r: 6 }}
                  activeDot={{ r: 8, fill: '#d946ef' }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="alcoholConsumed" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  name="Alcohol Event"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-600 font-mono">
              [ NO TELEMETRY DATA ]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
