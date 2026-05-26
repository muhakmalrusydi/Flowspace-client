import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useUIStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";

/**
 * Main authenticated layout shell.
 * Renders a fixed navbar, collapsible sidebar, and scrollable main content area.
 */
export default function Dashboard() {
  const sidebarOpen = useUIStore((s: { sidebarOpen: any }) => s.sidebarOpen);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Navbar — full width, fixed height */}
      <div className="h-14 shrink-0">
        <Navbar />
      </div>

      {/* Body — sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "shrink-0 border-r bg-card transition-all duration-200 overflow-hidden",
            sidebarOpen ? "w-56" : "w-0",
          )}
        >
          <div className="w-56 h-full">
            <Sidebar />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{}</main>
      </div>
    </div>
  );
}
