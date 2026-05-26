import { useAuth } from "@/hooks/use-auth";
import { useUIStore } from "@/stores/ui.store";
import { PanelLeft, LogOut } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <header className="flex items-center justify-between px-4 h-full border-b bg-card">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm">FlowSpace</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{user?.name}</span>
        <button
          onClick={() => signOut.mutate()}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
