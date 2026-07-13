"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveSettingsApi,
  createStaffApi,
  toggleStaffApi,
  deleteStaffApi,
} from "@/lib/api";
import { settingsSchema } from "@/lib/validators/admin";
import { STAFF_ROLE } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { SettingsFormInput } from "@/lib/validators/admin";
import type { StaffListItem } from "@/server/repositories/staff.repository";

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const fieldCls =
  "w-full min-h-[48px] rounded-xl border-2 border-[#E1EBF0] bg-white px-3.5 text-[14.5px] text-ink outline-none transition-colors focus:border-primary disabled:bg-[#F4F6F8] disabled:text-ink-muted";
const labelCls = "font-heading text-[12.5px] font-bold text-ink";

function SectionCard({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E1EBF0] bg-white p-6 shadow-[0_2px_10px_rgba(26,43,60,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-heading text-[16px] font-extrabold text-ink">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative h-8 w-[54px] flex-none rounded-full transition-colors",
        on ? "bg-success" : "bg-[#CBD5E1]",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-[26px] w-[26px] rounded-full bg-white shadow transition-all",
          on ? "left-[25px]" : "left-[3px]",
        )}
      />
    </button>
  );
}

export function SettingsForm({
  initial,
  staff,
  isAdmin,
  selfId,
}: {
  initial: SettingsFormInput;
  staff: StaffListItem[];
  isAdmin: boolean;
  selfId: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<SettingsFormInput>(initial);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);

  function patch(p: Partial<SettingsFormInput>) {
    setValues((v) => ({ ...v, ...p }));
    setDirty(true);
  }
  function patchDay(day: number, p: Partial<SettingsFormInput["schedule"][number]>) {
    patch({
      schedule: values.schedule.map((r) => (r.day === day ? { ...r, ...p } : r)),
    });
  }

  async function save() {
    const parsed = settingsSchema.safeParse(values);
    if (!parsed.success) {
      toast("Please check the settings — some fields are invalid");
      return;
    }
    setBusy(true);
    const res = await saveSettingsApi(parsed.data);
    setBusy(false);
    if (!res.ok) {
      toast(res.error);
      return;
    }
    setDirty(false);
    toast("Settings saved");
    router.refresh();
  }

  if (!isAdmin) {
    return (
      <div className="max-w-[560px] rounded-2xl border border-[#E1EBF0] bg-white p-8 text-center shadow-soft">
        <div className="font-heading text-[17px] font-extrabold text-ink">Admins only</div>
        <p className="mt-2 text-[14px] text-ink-muted">
          Only the clinic admin can change settings. Ask the admin for access.
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-w-[900px] flex-col gap-4 pb-24">
      {/* Clinic profile */}
      <SectionCard title="Clinic Profile">
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Clinic name</span>
          <input className={fieldCls} value={values.clinicName} onChange={(e) => patch({ clinicName: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Address</span>
          <input className={fieldCls} value={values.address} onChange={(e) => patch({ address: e.target.value })} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Phone</span>
            <input className={fieldCls} value={values.phones[0] ?? ""} onChange={(e) => patch({ phones: [e.target.value, ...values.phones.slice(1)] })} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Email</span>
            <input className={fieldCls} value={values.email ?? ""} onChange={(e) => patch({ email: e.target.value })} />
          </label>
        </div>
      </SectionCard>

      {/* Chamber schedule */}
      <SectionCard title="Chamber Schedule">
        <div className="flex flex-col gap-2.5 sm:gap-0">
          {/* Column headers — desktop only */}
          <div className="hidden border-b border-[#EDF4F7] pb-2 font-heading text-[11.5px] font-bold tracking-[0.05em] text-ink-muted sm:grid sm:grid-cols-[1.2fr_1fr_1fr_1fr] sm:gap-2">
            <div>DAY</div><div>OPENS</div><div>CLOSES</div><div>STATUS</div>
          </div>
          {values.schedule.map((r) => (
            <div
              key={r.day}
              className="rounded-xl border border-[#EDF4F7] p-3 sm:grid sm:grid-cols-[1.2fr_1fr_1fr_1fr] sm:items-center sm:gap-2 sm:rounded-none sm:border-0 sm:border-b sm:border-[#F1F5F8] sm:p-0 sm:py-2 sm:last:border-b-0"
            >
              {/* Day name + (mobile) on/off toggle */}
              <div className="mb-3 flex items-center justify-between sm:mb-0 sm:block">
                <span className="text-[14px] font-semibold text-ink">{DAY_NAMES[r.day]}</span>
                <span className="flex items-center gap-2 sm:hidden">
                  <span className="text-[12.5px] font-semibold text-ink-muted">{r.isOff ? "Closed" : "Open"}</span>
                  <Toggle on={!r.isOff} onClick={() => patchDay(r.day, { isOff: !r.isOff })} label={`Toggle ${DAY_NAMES[r.day]}`} />
                </span>
              </div>
              {/* Time inputs — 2-col on mobile, dissolve into the grid on desktop */}
              <div className="grid grid-cols-2 gap-2.5 sm:contents">
                <label className="flex flex-col gap-1 sm:block">
                  <span className="text-[11px] font-bold text-ink-muted sm:hidden">Opens</span>
                  <input type="time" disabled={r.isOff} value={r.open} onChange={(e) => patchDay(r.day, { open: e.target.value })} className={cn(fieldCls, "min-h-[44px] px-2.5")} />
                </label>
                <label className="flex flex-col gap-1 sm:block">
                  <span className="text-[11px] font-bold text-ink-muted sm:hidden">Closes</span>
                  <input type="time" disabled={r.isOff} value={r.close} onChange={(e) => patchDay(r.day, { close: e.target.value })} className={cn(fieldCls, "min-h-[44px] px-2.5")} />
                </label>
              </div>
              {/* Status toggle — desktop column only */}
              <div className="hidden items-center gap-2.5 sm:flex">
                <Toggle on={!r.isOff} onClick={() => patchDay(r.day, { isOff: !r.isOff })} label={`Toggle ${DAY_NAMES[r.day]}`} />
                <span className="text-[12.5px] font-semibold text-ink-muted">{r.isOff ? "Off" : "Open"}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Appointment settings */}
      <SectionCard title="Appointment Settings">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Slot duration</span>
            <select className={fieldCls} value={values.slotDurationMin} onChange={(e) => patch({ slotDurationMin: Number(e.target.value) })}>
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Max serials per day</span>
            <input className={fieldCls} type="number" value={values.maxSerialsPerDay} onChange={(e) => patch({ maxSerialsPerDay: Number(e.target.value) })} />
          </label>
          <div className="flex flex-col gap-1.5">
            <span className={labelCls}>Online booking</span>
            <div className="flex min-h-[48px] items-center gap-2.5">
              <Toggle on={values.onlineBookingEnabled} onClick={() => patch({ onlineBookingEnabled: !values.onlineBookingEnabled })} label="Toggle online booking" />
              <span className="text-[13px] font-semibold text-ink-muted">
                {values.onlineBookingEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* SMS templates */}
      <SectionCard
        title="SMS Templates"
        right={
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-muted">
            Variables:
            {["{patient_name}", "{serial_no}", "{time}"].map((v) => (
              <code key={v} className="rounded bg-primary-light px-2 py-0.5 font-heading text-[11px] font-bold text-primary">{v}</code>
            ))}
          </div>
        }
      >
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Booking Confirmation SMS</span>
          <textarea className={cn(fieldCls, "min-h-[72px] resize-none py-2.5 leading-relaxed")} value={values.smsTemplates.confirmation} onChange={(e) => patch({ smsTemplates: { ...values.smsTemplates, confirmation: e.target.value } })} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Reminder SMS</span>
          <textarea className={cn(fieldCls, "min-h-[72px] resize-none py-2.5 leading-relaxed")} value={values.smsTemplates.reminder} onChange={(e) => patch({ smsTemplates: { ...values.smsTemplates, reminder: e.target.value } })} />
        </label>
      </SectionCard>

      {/* Staff & access */}
      <SectionCard
        title="Staff & Access"
        right={
          <button
            type="button"
            onClick={() => setStaffOpen(true)}
            className="min-h-[44px] rounded-xl border-2 border-primary px-4 font-heading text-[13px] font-bold text-primary transition-colors hover:bg-primary-light/60"
          >
            + Add Staff
          </button>
        }
      >
        <div className="flex flex-col gap-2">
          {staff.map((s) => (
            <StaffRow key={s.id} member={s} isSelf={s.id === selfId} />
          ))}
        </div>
      </SectionCard>

      {/* Sticky save */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E1EBF0] bg-white/95 px-5 py-3.5 backdrop-blur lg:left-[230px]">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-3">
          <span className="text-[13px] text-ink-muted">
            {dirty ? "You have unsaved changes" : "All changes saved"}
          </span>
          <button
            type="button"
            disabled={!dirty || busy}
            onClick={save}
            className={cn(
              "min-h-[48px] rounded-xl px-8 font-heading text-[14.5px] font-bold text-white transition-colors",
              dirty && !busy ? "bg-primary hover:bg-primary-dark" : "cursor-not-allowed bg-[#9CC5C4]",
            )}
          >
            {busy ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>

      {staffOpen && <AddStaffModal onClose={() => setStaffOpen(false)} />}
    </div>
  );
}

function StaffRow({
  member,
  isSelf,
}: {
  member: StaffListItem;
  isSelf: boolean;
}) {
  const toast = useToast();
  const router = useRouter();
  const [active, setActive] = useState(member.isActive);
  const [removing, setRemoving] = useState(false);

  async function toggle() {
    const next = !active;
    setActive(next);
    const res = await toggleStaffApi(member.id, next);
    if (!res.ok) {
      setActive(!next);
      toast(res.error);
      return;
    }
    toast(`${member.name} ${next ? "activated" : "deactivated"}`);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm(`Remove ${member.name} permanently? They won't be able to log in.`)) return;
    setRemoving(true);
    const res = await deleteStaffApi(member.id);
    setRemoving(false);
    if (!res.ok) {
      toast(res.error);
      return;
    }
    toast(`${member.name} removed`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#EDF4F7] px-4 py-3">
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary-light font-heading text-[14px] font-extrabold text-primary">
        {member.name.charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-[14px] font-semibold", active ? "text-ink" : "text-ink-muted line-through")}>
          {member.name}
          {isSelf && <span className="ml-2 text-[11px] font-bold text-primary">(you)</span>}
        </span>
        <span className="block text-[12px] capitalize text-ink-muted">
          {member.role} · {member.phone.replace(/^\+88/, "")}
        </span>
      </span>
      <Toggle on={active} onClick={toggle} label={`Toggle ${member.name}`} />
      {!isSelf && (
        <button
          type="button"
          disabled={removing}
          onClick={remove}
          aria-label={`Remove ${member.name}`}
          title="Remove staff member"
          className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-[#E1EBF0] text-[14px] text-ink-muted transition-colors hover:border-danger hover:text-danger disabled:opacity-60"
        >
          🗑
        </button>
      )}
    </div>
  );
}

function AddStaffModal({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const router = useRouter();
  const [values, setValues] = useState({ name: "", phone: "", password: "", role: "receptionist" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    if (values.name.trim().length < 2 || values.password.length < 6) {
      setError("Name and a 6+ character password are required.");
      return;
    }
    setBusy(true);
    const res = await createStaffApi(values);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast(`${values.name} added as ${values.role}`);
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-6" onClick={onClose}>
      <div
        className="flex w-[420px] max-w-full animate-scale-in flex-col gap-3.5 rounded-[20px] bg-white p-6 shadow-[0_24px_60px_rgba(26,43,60,0.35)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add staff"
      >
        <div className="font-heading text-[18px] font-extrabold text-ink">Add Staff Member</div>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Full name</span>
          <input className={fieldCls} value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Mobile number</span>
          <input className={fieldCls} type="tel" placeholder="01XXXXXXXXX" value={values.phone} onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Password</span>
            <input className={fieldCls} type="password" value={values.password} onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>Role</span>
            <select className={fieldCls} value={values.role} onChange={(e) => setValues((v) => ({ ...v, role: e.target.value }))}>
              {STAFF_ROLE.map((r) => (
                <option key={r} value={r} className="capitalize">{r}</option>
              ))}
            </select>
          </label>
        </div>
        {error && <p className="text-[13.5px] text-danger">{error}</p>}
        <button
          type="button"
          disabled={busy}
          onClick={submit}
          className="min-h-[52px] rounded-xl bg-primary font-heading text-[15px] font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add Staff ✓"}
        </button>
      </div>
    </div>
  );
}
