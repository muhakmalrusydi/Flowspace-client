import { Link, useParams } from "@tanstack/react-router";
import { useWorkspaces } from "@/hooks/use-workspace";
import { useProjects } from "@/hooks/use-projects";
import { Settings, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  // workspaceId may not exist on all routes
  const params = useParams({ strict: false }) as { workspaceId?: string };
  const workspaceId = params.workspaceId ?? "";

  const { data: workspaces } = useWorkspaces();
  const { data: projects } = useProjects(workspaceId);

  return (
    <nav className="flex flex-col h-full p-3 gap-1 overflow-y-auto">
      {/* Workspace switcher placeholder */}
      <div className="mb-2 px-2 py-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Workspaces
        </p>
      </div>

      {workspaces?.map((ws) => (
        <Link
          key={ws.id}
          to="/workspace/$workspaceId"
          params={{ workspaceId: ws.id }}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors",
            ws.id === workspaceId && "bg-muted font-medium",
          )}
        >
          <span className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-xs font-bold">
            {ws.name[0]}
          </span>
          {ws.name}
        </Link>
      ))}

      {/* Projects for current workspace */}
      {workspaceId && projects && projects.length > 0 && (
        <>
          <div className="mt-4 mb-2 px-2 py-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Projects
            </p>
          </div>
          {projects.map((project) => (
            <Link
              key={project.id}
              to="/workspace/$workspaceId/projects/$projectId"
              params={{ workspaceId, projectId: project.id }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors"
            >
              <FolderKanban
                className="w-4 h-4 shrink-0"
                style={{ color: project.color }}
              />
              {project.name}
            </Link>
          ))}
        </>
      )}

      {/* Settings link */}
      {workspaceId && (
        <div className="mt-auto pt-2 border-t">
          <Link
            to="/workspace/$workspaceId/settings"
            params={{ workspaceId }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors text-muted-foreground"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      )}
    </nav>
  );
}
