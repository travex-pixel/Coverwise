import { ApplicationProvider } from "@/lib/application/store";
import { CompareShell } from "@/components/compare/shell";

export default function CompareLayout({ children }: LayoutProps<"/compare">) {
  return (
    <ApplicationProvider>
      <CompareShell>{children}</CompareShell>
    </ApplicationProvider>
  );
}
