/** Decorative dimension line with end ticks and a centered mono label. */
export function Dimension({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`dim ${className}`}>
      <span>{label}</span>
    </div>
  );
}
