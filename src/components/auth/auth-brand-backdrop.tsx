import styles from "./auth-brand-backdrop.module.css";

export function AuthBrandBackdrop() {
  return (
    <svg
      className={styles.backdrop}
      viewBox="0 0 640 720"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="auth-grid"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="640" height="720" fill="url(#auth-grid)" />
      <path
        d="M40 560 C120 500, 200 420, 280 340 C360 260, 440 180, 560 80"
        fill="none"
        stroke="rgba(24,184,198,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="120" cy="500" r="3" fill="rgba(24,184,198,0.6)" />
      <circle cx="280" cy="340" r="3" fill="rgba(53,120,229,0.55)" />
      <circle cx="440" cy="180" r="3" fill="rgba(24,184,198,0.6)" />
      <circle cx="520" cy="120" r="2.5" fill="rgba(255,255,255,0.35)" />
      <circle cx="180" cy="620" r="2" fill="rgba(255,255,255,0.25)" />
      <circle cx="360" cy="260" r="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
}
