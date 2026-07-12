/** Shared per-step heading (title + optional subtitle). */
export function StepHeading({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="font-heading text-[22px] font-extrabold leading-[1.3] text-ink md:text-[26px]">
        {title}
      </h2>
      {sub && (
        <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-muted">{sub}</p>
      )}
    </div>
  );
}
