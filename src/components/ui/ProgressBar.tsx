interface Props {
  value: number; // 0–1
  current: number;
  total: number;
}

export function ProgressBar({ value, current, total }: Props) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-white/40 mb-1.5">
        <span>Note {current + 1} of {total}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/60 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}
