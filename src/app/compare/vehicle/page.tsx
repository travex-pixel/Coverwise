import type { Metadata } from "next";
import { VehicleStep } from "@/components/compare/vehicle-step";

export const metadata: Metadata = { title: "Your car" };

export default function VehiclePage() {
  return <VehicleStep />;
}
