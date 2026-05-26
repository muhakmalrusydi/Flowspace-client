import { createFileRoute } from "@tanstack/react-router";
import { useProject } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { useTaskFilters } from "@/hooks/use-task-filters";

export const Route = createFileRoute(
  "/_authenticated/workspace/$workspaceId/projects/$projectId/",
)({
  component: ProjectPage,
});

function ProjectPage() {
  const { workspaceId, projectId } = Route.useParams();
  const { data: project } = useProject(workspaceId, projectId);
  const { data: tasks = [], isLoading } = useTasks(workspaceId, projectId);
  const { filters, setFilter, filteredTasks } = useTaskFilters(tasks);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project?.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search filter */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => setFilter("search", e.target.value)}
        className="w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm"
      />

      {/* Task list */}
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 rounded-lg border bg-card p-3"
          >
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {task.status}
            </span>
            <span className="flex-1 text-sm font-medium">{task.title}</span>
            <span className="text-xs text-muted-foreground">
              {task.priority}
            </span>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tasks found.
          </div>
        )}
      </div>
    </div>
  );
}
