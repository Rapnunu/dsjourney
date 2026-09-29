import type { SVGProps } from "react";

type LogoVariant = "horizontal" | "icon" | "icon-dark" | "mark";
type LogoTone = "default" | "public";

interface DsjourneyLogoProps extends SVGProps<SVGSVGElement> {
  variant?: LogoVariant;
  showTagline?: boolean;
  tone?: LogoTone;
  /** Light DS lettering for large auth-panel mark on dark backgrounds. */
  brightDsLetters?: boolean;
}

function JourneyGradientDef({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#14b8a6" />
      <stop offset="50%" stopColor="#22d3ee" />
      <stop offset="100%" stopColor="#38bdf8" />
    </linearGradient>
  );
}

function IconGradientDef({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#0c1929" />
      <stop offset="100%" stopColor="#132337" />
    </linearGradient>
  );
}

function JourneyPath({
  gradientId,
  useGradient = false,
}: {
  gradientId: string;
  useGradient?: boolean;
}) {
  const stroke = useGradient ? `url(#${gradientId})` : "#18B8C6";

  return (
    <>
      <path
        d="M14 58 C22 52, 30 38, 42 28 C54 18, 62 14, 72 10"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="22" cy="50" r="3.5" fill="#38bdf8" />
      <circle cx="38" cy="34" r="3.5" fill="#22d3ee" />
      <circle cx="54" cy="22" r="3.5" fill="#2dd4bf" />
      <path d="M68 12 L76 8 L72 18 Z" fill="#3b82f6" />
    </>
  );
}

function DsLetters({
  primary = "#12304A",
  secondary = "#0D1B2A",
}: {
  primary?: string;
  secondary?: string;
}) {
  return (
    <>
      <text
        x="8"
        y="52"
        fontFamily="system-ui, sans-serif"
        fontSize="44"
        fontWeight="800"
        fill={primary}
      >
        D
      </text>
      <text
        x="38"
        y="52"
        fontFamily="system-ui, sans-serif"
        fontSize="44"
        fontWeight="800"
        fill={secondary}
      >
        S
      </text>
    </>
  );
}

export function DsjourneyLogo({
  variant = "horizontal",
  showTagline = false,
  tone = "default",
  brightDsLetters = false,
  className,
  ...props
}: DsjourneyLogoProps) {
  const isPublic = tone === "public";
  const gradientId = `journey-gradient-${variant}`;

  if (variant === "icon" || variant === "icon-dark") {
    const isDark = variant === "icon-dark" || isPublic;
    const iconBgId = `icon-bg-${variant}`;

    return (
      <svg
        viewBox="0 0 80 80"
        role="img"
        aria-label="DSJourney"
        className={className}
        {...props}
      >
        <defs>
          <JourneyGradientDef id={gradientId} />
          {isPublic && <IconGradientDef id={iconBgId} />}
        </defs>
        <rect
          width="80"
          height="80"
          rx="18"
          fill={isPublic ? `url(#${iconBgId})` : isDark ? "#12304A" : "#FFFFFF"}
          stroke={isDark || isPublic ? "#12304A" : "#DCE3EA"}
          strokeWidth="1"
        />
        <DsLetters
          primary={isDark || isPublic ? "#FFFFFF" : "#12304A"}
          secondary={isDark || isPublic ? "#E2E8F0" : "#0D1B2A"}
        />
        <JourneyPath gradientId={gradientId} useGradient={isPublic} />
      </svg>
    );
  }

  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 80 72"
        role="img"
        aria-label="DSJourney"
        className={className}
        {...props}
      >
        <defs>
          <JourneyGradientDef id={gradientId} />
        </defs>
        <DsLetters
          primary={
            brightDsLetters
              ? "#F4F7FA"
              : isPublic
                ? "#1e3a5f"
                : "#12304A"
          }
          secondary={
            brightDsLetters
              ? "#E2E8F0"
              : isPublic
                ? "#0f2744"
                : "#0D1B2A"
          }
        />
        <JourneyPath gradientId={gradientId} useGradient={isPublic} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 220 48"
      role="img"
      aria-label="DSJourney"
      className={className}
      {...props}
    >
      <defs>
        <JourneyGradientDef id={gradientId} />
      </defs>
      <g transform="scale(0.55) translate(0, -8)">
        <DsLetters
          primary={isPublic ? "#FFFFFF" : "#12304A"}
          secondary={isPublic ? "#E2E8F0" : "#0D1B2A"}
        />
        <JourneyPath gradientId={gradientId} useGradient={isPublic} />
      </g>
      <text
        x="52"
        y="32"
        fontFamily="system-ui, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="currentColor"
      >
        DS
        <tspan fontWeight="500">Journey</tspan>
      </text>
      {showTagline && (
        <text
          x="52"
          y="44"
          fontFamily="system-ui, sans-serif"
          fontSize="7"
          fontWeight="500"
          letterSpacing="0.12em"
          fill="currentColor"
          opacity="0.7"
        >
          YOUR DATA SCIENCE JOURNEY STARTS HERE
        </text>
      )}
    </svg>
  );
}
