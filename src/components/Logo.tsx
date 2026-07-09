type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  tagline?: boolean;
  className?: string;
};

function LogoMark({ size = 36 }: { size?: number }) {
  const cx = 100;
  const cy = 100;
  const count = 16;
  const headR = 7;
  const headRadius = 82; // distance from center to head
  const wedgeOuter = 74; // wide end of wedge (near head)
  const wedgeInner = 24; // narrow end of wedge (toward center)
  const wedgeWideHalf = 5.5;
  const wedgeNarrowHalf = 1.6;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="ow-grad" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#ee8a6d" />
          <stop offset="45%" stopColor="#cdb6a4" />
          <stop offset="55%" stopColor="#a9bfb4" />
          <stop offset="100%" stopColor="#6fa8b0" />
        </linearGradient>
        <radialGradient id="ow-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g fill="url(#ow-grad)">
        {Array.from({ length: count }).map((_, i) => {
          const angle = (360 / count) * i;
          return (
            <g key={i} transform={`rotate(${angle} ${cx} ${cy})`}>
              {/* tapered wedge (body) */}
              <polygon
                points={`
                  ${cx - wedgeWideHalf},${cy - wedgeOuter}
                  ${cx + wedgeWideHalf},${cy - wedgeOuter}
                  ${cx + wedgeNarrowHalf},${cy - wedgeInner}
                  ${cx - wedgeNarrowHalf},${cy - wedgeInner}
                `}
              />
              {/* head */}
              <circle cx={cx} cy={cy - headRadius} r={headR} />
            </g>
          );
        })}
      </g>

      {/* central luminous core */}
      <circle cx={cx} cy={cy} r={54} fill="url(#ow-glow)" />
    </svg>
  );
}

export function Logo({ size = 36, withWordmark = true, tagline = false, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className="font-display text-xl tracking-tight text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
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
