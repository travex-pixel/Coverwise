import { AlertTriangle, Check, Clock, Hand, Loader2, PlugZap, Send, XCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { STATUS_LABELS, type ProviderStatus } from "@/lib/providers/types";

const MAP: Record<ProviderStatus, { tone: NonNullable<BadgeProps["tone"]>; icon: typeof Check; spin?: boolean }> = {
  NOT_CONNECTED: { tone: "neutral", icon: PlugZap },
  READY: { tone: "neutral", icon: Clock },
  SUBMITTED: { tone: "neutral", icon: Send },
  QUOTING: { tone: "champagne", icon: Loader2, spin: true },
  QUOTED: { tone: "success", icon: Check },
  REFERRED: { tone: "warn", icon: Clock },
  DECLINED: { tone: "danger", icon: XCircle },
  ERROR: { tone: "danger", icon: AlertTriangle },
  MANUAL_ACTION_REQUIRED: { tone: "warn", icon: Hand },
};

export function StatusBadge({
  status,
  dark,
  size = "sm",
}: {
  status: ProviderStatus;
  dark?: boolean;
  size?: BadgeProps["size"];
}) {
  const m = MAP[status];
  const Icon = m.icon;
  return (
    <Badge tone={dark ? "glass" : m.tone} size={size}>
      <Icon className={m.spin ? "size-3 animate-spin" : "size-3"} strokeWidth={2.25} aria-hidden />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
