type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  tagline?: boolean;
  className?: string;
};

export function Logo({ size = 36, withWordmark = true, tagline = false, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 60"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <circle cx="30" cy="30" r="26" fill="oklch(0.18 0.012 60)" />
        <circle cx="50" cy="30" r="26" fill="oklch(0.72 0.09 85)" style={{ mixBlendMode: "multiply" }} />
      </svg>
      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-xl tracking-tight text-ink" style={{ fontFamily: "var(--font-display)" }}>
            OwnWay
          </span>
          {tagline && (
            <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gold">
              travel your way
            </span>
          )}
        </div>
      )}
    </div>
  );
}
