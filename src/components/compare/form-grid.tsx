import { cn } from "@/lib/utils";

export function FormGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2", className)}>{children}</div>;
}

export function FormSection({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-1", className)}>
      {title && <h2 className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">{title}</h2>}
      {children}
    </section>
  );
}

/* Conditional reveal with a gentle height transition. */
export function Reveal({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-(--dur-slow) ease-(--ease-out)",
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
      aria-hidden={!show}
    >
      <div className={cn("min-h-0", !show && "invisible overflow-hidden")}>{children}</div>
    </div>
  );
}
