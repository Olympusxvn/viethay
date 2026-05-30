import { AppSidebar } from "@/components/shell/app-sidebar";
import { ApiKeyDialog } from "@/components/shell/api-key-dialog";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="viethay-shell flex min-h-full flex-1">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-auto">{children}</div>
      <ApiKeyDialog />
    </div>
  );
}
