import { connectDB } from "@/server/db";
import { Appointment } from "@/server/models/Appointment";
import { Payment } from "@/server/models/Payment";
import { Patient } from "@/server/models/Patient";
import { CLINIC_TZ, clinicMonthKey, clinicMonthStart } from "@/lib/booking";

/**
 * Monthly report — all numbers via aggregation pipelines (never JS loops
 * over full collections, per data-models.md scale notes).
 */

export interface MonthlyReport {
  monthLabel: string;
  kpis: {
    patientsThisMonth: number;
    revenueThisMonth: number;
    totalDue: number;
    newPatients: number;
  };
  popularServices: Array<{ label: string; count: number }>;
  newVsReturning: { newCount: number; returningCount: number };
  revenueTrend: Array<{ label: string; amount: number }>;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export async function getMonthlyReport(): Promise<MonthlyReport> {
  await connectDB();
  // Clinic time (Asia/Dhaka) — appointment `date`s are Dhaka day-strings, so
  // month boundaries and timestamp comparisons must be Dhaka-based too.
  const monthPrefix = clinicMonthKey(); // YYYY-MM
  const [y, m1] = monthPrefix.split("-").map(Number);
  const m = m1 - 1; // 0-based, for calendar arithmetic below
  const monthStart = clinicMonthStart(0);
  const sixMonthsAgo = clinicMonthStart(5);

  const [
    apptAgg,
    revenueAgg,
    dueAgg,
    newPatientsCount,
    popularAgg,
    visitorsAgg,
    trendAgg,
  ] = await Promise.all([
    // distinct patients seen this month
    Appointment.aggregate<{ _id: null; patients: number }>([
      { $match: { date: { $regex: `^${monthPrefix}` }, status: { $ne: "cancelled" } } },
      { $group: { _id: "$patient" } },
      { $count: "patients" },
    ]).then((r) => r[0]?.patients ?? 0),
    // revenue this month (sum of transactions)
    Payment.aggregate<{ _id: null; total: number }>([
      { $unwind: "$transactions" },
      { $match: { "transactions.at": { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$transactions.amount" } } },
    ]).then((r) => r[0]?.total ?? 0),
    // outstanding due (all time)
    Payment.aggregate<{ _id: null; total: number }>([
      { $match: { status: { $ne: "paid" } } },
      { $group: { _id: null, total: { $sum: "$dueAmount" } } },
    ]).then((r) => r[0]?.total ?? 0),
    Patient.countDocuments({ createdAt: { $gte: monthStart } }),
    // popular services this month
    Appointment.aggregate<{ _id: string; count: number }>([
      { $match: { date: { $regex: `^${monthPrefix}` }, status: { $ne: "cancelled" } } },
      { $group: { _id: "$serviceName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    // new vs returning among this month's visitors
    Appointment.aggregate<{ _id: string; isNew: number }>([
      { $match: { date: { $regex: `^${monthPrefix}` }, status: { $ne: "cancelled" } } },
      { $group: { _id: "$patient" } },
      {
        $lookup: {
          from: "patients",
          localField: "_id",
          foreignField: "_id",
          as: "p",
        },
      },
      { $unwind: "$p" },
      {
        $project: {
          isNew: { $cond: [{ $gte: ["$p.createdAt", monthStart] }, 1, 0] },
        },
      },
    ]),
    // 6-month revenue trend
    Payment.aggregate<{ _id: { y: number; m: number }; total: number }>([
      { $unwind: "$transactions" },
      { $match: { "transactions.at": { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            y: { $year: { date: "$transactions.at", timezone: CLINIC_TZ } },
            m: { $month: { date: "$transactions.at", timezone: CLINIC_TZ } },
          },
          total: { $sum: "$transactions.amount" },
        },
      },
    ]),
  ]);

  const newCount = visitorsAgg.filter((v) => v.isNew === 1).length;
  const returningCount = visitorsAgg.length - newCount;

  // fill all 6 months even when empty
  const revenueTrend: Array<{ label: string; amount: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(y, m - i, 1));
    const hit = trendAgg.find(
      (t) => t._id.y === d.getUTCFullYear() && t._id.m === d.getUTCMonth() + 1,
    );
    revenueTrend.push({ label: MONTHS[d.getUTCMonth()], amount: hit?.total ?? 0 });
  }

  return {
    monthLabel: `${MONTHS[m]} ${y}`,
    kpis: {
      patientsThisMonth: apptAgg,
      revenueThisMonth: revenueAgg,
      totalDue: dueAgg,
      newPatients: newPatientsCount,
    },
    popularServices: popularAgg.map((p) => ({ label: p._id, count: p.count })),
    newVsReturning: { newCount, returningCount },
    revenueTrend,
  };
}
