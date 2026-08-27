import { useMemo } from "react";

export function Petals({ count = 18 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 12 + Math.random() * 14,
        size: 8 + Math.random() * 14,
        opacity: 0.35 + Math.random() * 0.5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="animate-petal absolute block"
          style={{
            left: `${p.left}%`,
            top: "-5vh",
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <path
              d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z"
              fill="var(--wine)"
              opacity="0.85"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
