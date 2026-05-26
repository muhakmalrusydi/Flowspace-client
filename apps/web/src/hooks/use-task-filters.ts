import { useState, useCallback } from "react";
import type { TaskStatus, TaskPriority, Task } from "@flowspace/types";

interface TaskFilters {
  status: TaskStatus | null;
  priority: TaskPriority | null;
  assigneeId: string | null;
  search: string;
}

const DEFAULT_FILTERS: TaskFilters = {
  status: null,
  priority: null,
  assigneeId: null,
  search: "",
};

/**
 * Manages client-side task filter state and returns a filtered task list.
 * Filters are applied in memory — no extra API calls needed.
 */
export function useTaskFilters(tasks: Task[] = []) {
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);

  const setFilter = useCallback(
    <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assigneeId && task.assignee?.id !== filters.assigneeId)
      return false;
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  return { filters, setFilter, resetFilters, filteredTasks };
}
