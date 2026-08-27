import { useEffect, useState } from "react";

const EVENT_ISO = "2026-09-12T09:00:00";

function diff(target: Date) {
  const now = new Date();
  const ms = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

export function Countdown() {
  const target = new Date(EVENT_ISO);
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items: [string, number][] = [
    ["Days", t.days],
    ["Hours", t.hours],
    ["Minutes", t.minutes],
    ["Seconds", t.seconds],
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 max-w-3xl mx-auto py-2">
      {items.map(([label, value], index) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center px-6 sm:px-10">
            <span className="font-display text-5xl sm:text-7xl text-sand tracking-tight tabular-nums">
              {mounted ? String(value).padStart(2, "0") : "--"}
            </span>
            <span className="font-sans-ui mt-3 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-ivory/70 font-light">
              {label}
            </span>
          </div>
          {index < items.length - 1 && (
            <div className="hidden sm:block h-14 w-px bg-sand/25" />
          )}
        </div>
      ))}
    </div>
  );
}
