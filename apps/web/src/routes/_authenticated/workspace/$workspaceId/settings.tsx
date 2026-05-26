import { createFileRoute } from "@tanstack/react-router";
import { useWorkspace } from "@/hooks/use-workspace";

export const Route = createFileRoute(
  "/_authenticated/workspace/$workspaceId/settings",
)({
  component: WorkspaceSettingsPage,
});

function WorkspaceSettingsPage() {
  const { workspaceId } = Route.useParams();
  const { data: workspace } = useWorkspace(workspaceId);

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Workspace Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage {workspace?.name}
        </p>
      </div>
      {/* Settings form will go here */}
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        Settings form coming soon.
      </div>
    </div>
  );
}
