import { cn } from "@/lib/utils";

const fieldCls =
  "w-full min-h-[52px] rounded-xl border-2 border-[#E1EBF0] px-4 text-[16px] text-ink outline-none transition-colors focus:border-primary";
const labelCls = "font-heading text-[14px] font-bold text-ink";

export interface DetailsValues {
  who: "self" | "family";
  name: string;
  phone: string;
  age: string;
  note: string;
}
export type DetailsErrors = Partial<Record<"name" | "phone" | "age", string>>;

/** Step 3 — who is coming + contact details. */
export function DetailsStep({
  values,
  errors,
  onChange,
  onWho,
  canConfirm,
  submitting,
  serverError,
  onConfirm,
}: {
  values: DetailsValues;
  errors: DetailsErrors;
  onChange: (patch: Partial<DetailsValues>) => void;
  onWho: (who: "self" | "family") => void;
  canConfirm: boolean;
  submitting: boolean;
  serverError: string;
  onConfirm: () => void;
}) {
  const nameLabel = values.who === "self" ? "Your Full Name" : "Patient's Full Name";

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pb-8 pt-6 lg:px-10 lg:pt-9">
      <h1 className="font-heading text-[24px] font-extrabold leading-[1.3] text-ink lg:text-[28px]">
        Almost done! Who is coming?
      </h1>

      {/* self / family toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-primary-light p-[5px]">
        {(["self", "family"] as const).map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => onWho(w)}
            className={cn(
              "min-h-[48px] rounded-[9px] font-heading text-[14px] font-bold transition-colors",
              values.who === w
                ? "bg-white text-primary shadow-[0_2px_8px_rgba(26,43,60,0.12)]"
                : "text-ink-muted",
            )}
          >
            {w === "self" ? "Booking for myself" : "For a family member"}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>{nameLabel}</span>
        <input
          type="text"
          value={values.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Rahima Akter"
          className={cn(fieldCls, errors.name && "border-danger")}
          autoComplete="name"
        />
        {errors.name && (
          <span className="text-[13px] text-danger">{errors.name}</span>
        )}
      </label>

      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <label className="flex flex-col gap-2">
          <span className={labelCls}>Mobile Number</span>
          <input
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="01XXXXXXXXX"
            className={cn(fieldCls, errors.phone && "border-danger")}
            autoComplete="tel"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelCls}>Age</span>
          <input
            type="number"
            value={values.age}
            onChange={(e) => onChange({ age: e.target.value })}
            placeholder="35"
            className={cn(fieldCls, errors.age && "border-danger")}
          />
        </label>
      </div>
      {(errors.phone || errors.age) && (
        <span className="-mt-2 text-[13px] text-danger">
          {errors.phone ?? errors.age}
        </span>
      )}

      <label className="flex flex-col gap-2">
        <span className={labelCls}>
          Briefly describe your problem{" "}
          <span className="font-medium text-ink-muted">(optional)</span>
        </span>
        <textarea
          value={values.note}
          onChange={(e) => onChange({ note: e.target.value })}
          placeholder="e.g. Tooth pain on the left side for 3 days"
          className={cn(fieldCls, "min-h-[84px] resize-none py-3.5 leading-[1.5]")}
        />
      </label>

      <p className="flex items-start gap-2 text-[13px] leading-[1.6] text-ink-muted">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-none">
          <path d="M12 21s-7-4.6-7-11a7 7 0 0 1 14 0c0 6.4-7 11-7 11Z" stroke="#0E7C7B" strokeWidth="1.8" />
        </svg>
        No email. No password. We only need this to confirm your serial by SMS.
      </p>

      {serverError && (
        <p className="text-[14px] text-danger" role="alert">
          {serverError}
        </p>
      )}

      <div className="mt-auto pt-2 md:flex md:justify-end">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm || submitting}
          className={cn(
            "min-h-[56px] w-full rounded-xl font-heading text-[17px] font-bold text-white shadow-[0_6px_20px_rgba(255,122,89,0.35)] transition-colors md:w-auto md:min-w-[280px] md:px-12",
            canConfirm && !submitting
              ? "bg-cta hover:bg-cta-dark"
              : "cursor-not-allowed bg-[#F0B4A2]",
          )}
        >
          {submitting ? "Confirming…" : "Confirm My Appointment ✓"}
        </button>
      </div>
    </div>
  );
}
