import { ToggleLeft, ToggleRight } from 'lucide-react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string; // Meaningful id requirement
}

export function ThickToggle({ label, checked, onChange, id }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all active:scale-[0.98] ${
        checked 
          ? 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
          : 'bg-zinc-900 border-zinc-800'
      }`}
    >
      <span className={`text-xl font-bold ${checked ? 'text-emerald-400' : 'text-zinc-400'}`}>
        {label}
      </span>
      {checked ? (
        <ToggleRight className="w-12 h-12 text-emerald-500" />
      ) : (
        <ToggleLeft className="w-12 h-12 text-zinc-600" />
      )}
    </button>
  );
}
