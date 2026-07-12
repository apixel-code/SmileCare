import { cn } from "@/lib/utils";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { StepHeading } from "./StepHeading";

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
  serverError,
}: {
  values: DetailsValues;
  errors: DetailsErrors;
  onChange: (patch: Partial<DetailsValues>) => void;
  onWho: (who: "self" | "family") => void;
  serverError: string;
}) {
  const nameLabel =
    values.who === "self" ? "Your Full Name" : "Patient's Full Name";

  return (
    <div>
      <StepHeading
        title="Almost done — who is coming?"
        sub="No email, no password. We only use this to confirm your serial by SMS."
      />

      {/* self / family toggle */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-primary-light p-[5px]">
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

      <div className="flex flex-col gap-4">
        <Field label={nameLabel} htmlFor="bk-name" error={errors.name}>
          <Input
            id="bk-name"
            value={values.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Rahima Akter"
            error={!!errors.name}
            autoComplete="name"
          />
        </Field>

        <div className="grid grid-cols-[2fr_1fr] gap-3">
          <Field label="Mobile Number" htmlFor="bk-phone" error={errors.phone}>
            <Input
              id="bk-phone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="01XXXXXXXXX"
              error={!!errors.phone}
              autoComplete="tel"
            />
          </Field>
          <Field label="Age" htmlFor="bk-age" error={errors.age}>
            <Input
              id="bk-age"
              type="number"
              value={values.age}
              onChange={(e) => onChange({ age: e.target.value })}
              placeholder="35"
              error={!!errors.age}
            />
          </Field>
        </div>

        <Field
          label="Briefly describe your problem (optional)"
          htmlFor="bk-note"
        >
          <Textarea
            id="bk-note"
            value={values.note}
            onChange={(e) => onChange({ note: e.target.value })}
            placeholder="e.g. Tooth pain on the left side for 3 days"
          />
        </Field>
      </div>

      {serverError && (
        <p className="mt-4 text-[14px] text-danger" role="alert">
          {serverError}
        </p>
      )}
    </div>
  );
}
