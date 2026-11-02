/** A framed view/detail on the sheet, with a small callout tab and leader line. */
export function View({
  label,
  scale = "1:1",
  id,
  className = "",
  children,
}: {
  label: string;
  scale?: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`view relative ${className}`}>
      <p aria-hidden="true" className="view-tab">
        <span>{label}</span>
        <span className="text-muted">{scale}</span>
      </p>
      {children}
    </section>
  );
}
