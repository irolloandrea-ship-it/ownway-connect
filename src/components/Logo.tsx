type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  tagline?: boolean;
  className?: string;
};

export function Logo({ size = 36, withWordmark = true, tagline = false, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <img
        src="/ownway-mark.png"
        alt="OwnWay"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
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
