import { createFileRoute } from "@tanstack/react-router";
import { useWorkspace } from "@/hooks/use-workspace";
import { useProjects } from "@/hooks/use-projects";

export const Route = createFileRoute("/_authenticated/workspace/$workspaceId/")(
  {
    component: WorkspacePage,
  },
);

function WorkspacePage() {
  const { workspaceId } = Route.useParams();
  const { data: workspace, isLoading: wsLoading } = useWorkspace(workspaceId);
  const { data: projects, isLoading: projLoading } = useProjects(workspaceId);

  if (wsLoading || projLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{workspace?.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {projects?.length ?? 0} project
          {projects?.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
          >
            <div
              className="w-3 h-3 rounded-full mb-3"
              style={{ backgroundColor: project.color }}
            />
            <h3 className="font-medium">{project.name}</h3>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
