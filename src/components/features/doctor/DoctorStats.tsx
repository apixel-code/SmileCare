import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { DOCTOR_STATS } from "@/lib/demo-data";

/** Animated stat counters on brand teal. */
export function DoctorStats() {
  return (
    <section className="bg-primary">
      <Container className="grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
        {DOCTOR_STATS.map((st) => (
          <div key={st.label} className="text-center">
            <CountUp
              value={st.value}
              decimals={st.decimals}
              suffix={st.suffix}
              className="block font-heading text-[40px] font-extrabold leading-[1.1] text-white"
            />
            <div className="mt-1.5 text-[14.5px] text-white/80">{st.label}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}
