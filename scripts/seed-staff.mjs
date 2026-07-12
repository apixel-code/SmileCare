/**
 * Seed a staff user. Usage:
 *   node scripts/seed-staff.mjs <phone> <password> [role] [name]
 * Example:
 *   node scripts/seed-staff.mjs 01700000000 secret123 admin "Clinic Admin"
 */
import { readFileSync } from "fs";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import mongoose from "mongoose";

const [phoneArg, password, role = "admin", name = "Clinic Admin"] =
  process.argv.slice(2);
if (!phoneArg || !password) {
  console.error("Usage: node scripts/seed-staff.mjs <phone> <password> [role] [name]");
  process.exit(1);
}
if (!["admin", "doctor", "receptionist"].includes(role)) {
  console.error("Role must be admin | doctor | receptionist");
  process.exit(1);
}

const normalize = (p) => {
  const d = p.replace(/[\s-]/g, "");
  if (d.startsWith("+88")) return d;
  if (d.startsWith("88")) return `+${d}`;
  return `+88${d}`;
};

const uri = readFileSync(".env.local", "utf8")
  .split("\n")
  .find((l) => l.startsWith("MONGODB_URI="))
  ?.slice("MONGODB_URI=".length)
  .trim();
if (!uri) {
  console.error("MONGODB_URI missing in .env.local");
  process.exit(1);
}

const scryptAsync = promisify(scrypt);
const salt = randomBytes(16).toString("hex");
const derived = await scryptAsync(password, salt, 64);
const passwordHash = `${salt}:${derived.toString("hex")}`;

await mongoose.connect(uri, { dbName: process.env.MONGODB_DB ?? "smilecare" });
const phone = normalize(phoneArg);
await mongoose.connection.db.collection("staffs").updateOne(
  { phone },
  {
    $set: { name, phone, passwordHash, role, isActive: true, updatedAt: new Date() },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true },
);
console.log(`✓ staff upserted: ${name} (${phone}) role=${role}`);
await mongoose.disconnect();
