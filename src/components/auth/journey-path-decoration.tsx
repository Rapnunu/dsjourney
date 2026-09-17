import styles from "./journey-path-decoration.module.css";

export function JourneyPathDecoration() {
  return (
    <svg
      className={styles.path}
      viewBox="0 0 320 120"
      role="img"
      aria-hidden="true"
    >
      <path
        d="M8 96 C48 88, 88 72, 128 56 C168 40, 208 28, 280 12"
        fill="none"
        stroke="#18B8C6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="48" cy="86" r="5" fill="#18B8C6" />
      <circle cx="128" cy="56" r="5" fill="#3578E5" />
      <circle cx="208" cy="28" r="5" fill="#18B8C6" />
      <path d="M272 14 L292 8 L284 26 Z" fill="#3578E5" />
    </svg>
  );
}
