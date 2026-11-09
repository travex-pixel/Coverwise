import type { Metadata } from "next";
import { DriverStep } from "@/components/compare/driver-step";

export const metadata: Metadata = { title: "Driver" };

export default function DriverPage() {
  return <DriverStep />;
}
