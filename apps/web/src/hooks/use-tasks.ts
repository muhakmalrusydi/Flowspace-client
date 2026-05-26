import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Task, ApiResponse } from "@flowspace/types";
import type { CreateTaskInput, UpdateTaskInput } from "@flowspace/validators";

export function useTasks(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.all(workspaceId, projectId),
    queryFn: () =>
      apiClient
        .get<
          ApiResponse<Task[]>
        >(`/api/workspaces/${workspaceId}/projects/${projectId}/tasks`)
        .then((r) => r.data),
    enabled: !!workspaceId && !!projectId,
  });
}

export function useTask(
  workspaceId: string,
  projectId: string,
  taskId: string,
) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(workspaceId, projectId, taskId),
    queryFn: () =>
      apiClient
        .get<
          ApiResponse<Task>
        >(`/api/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`)
        .then((r) => r.data),
    enabled: !!workspaceId && !!projectId && !!taskId,
  });
}

export function useCreateTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskInput) =>
      apiClient
        .post<
          ApiResponse<Task>
        >(`/api/workspaces/${workspaceId}/projects/${projectId}/tasks`, data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspaceId, projectId),
      });
    },
  });
}

export function useUpdateTask(
  workspaceId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTaskInput) =>
      apiClient
        .patch<
          ApiResponse<Task>
        >(`/api/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspaceId, projectId),
      });
    },
  });
}

export function useDeleteTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      apiClient.delete(
        `/api/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.all(workspaceId, projectId),
      });
    },
  });
}
