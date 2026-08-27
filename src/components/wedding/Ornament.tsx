export function Ornament({ label }: { label?: string }) {
  return (
    <div className="ornament-divider my-6">
      <span className="ornament-line" />
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path
          d="M16 3l2.6 8 8.4.6-6.5 5.4 2.1 8.2L16 20.8 9.4 25.2l2.1-8.2L5 11.6 13.4 11 16 3z"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
      {label ? (
        <span className="font-sans-ui text-[10px] uppercase tracking-[0.4em] text-primary">
          {label}
        </span>
      ) : null}
      <span className="ornament-line" />
    </div>
  );
}
