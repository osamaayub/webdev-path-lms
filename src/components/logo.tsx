// Three stops on a line: the product in one glance. Colours follow the theme.
export function Logo() {
  return (
    <svg width="26" height="16" viewBox="0 0 34 20" aria-hidden="true">
      <path d="M3 15 C 12 15, 12 5, 21 5 L 31 5" fill="none" stroke="#E4572E" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="3" cy="15" r="3" fill="var(--card)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="17" cy="9" r="3" fill="var(--card)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="31" cy="5" r="3" fill="var(--ink)" />
    </svg>
  );
}
