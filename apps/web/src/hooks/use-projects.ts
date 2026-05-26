import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Project, ApiResponse } from "@flowspace/types";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@flowspace/validators";

export function useProjects(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.projects.all(workspaceId),
    queryFn: () =>
      apiClient
        .get<ApiResponse<Project[]>>(`/api/workspaces/${workspaceId}/projects`)
        .then((r) => r.data),
    enabled: !!workspaceId,
  });
}

export function useProject(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(workspaceId, projectId),
    queryFn: () =>
      apiClient
        .get<
          ApiResponse<Project>
        >(`/api/workspaces/${workspaceId}/projects/${projectId}`)
        .then((r) => r.data),
    enabled: !!workspaceId && !!projectId,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectInput) =>
      apiClient
        .post<
          ApiResponse<Project>
        >(`/api/workspaces/${workspaceId}/projects`, data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all(workspaceId),
      });
    },
  });
}

export function useUpdateProject(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProjectInput) =>
      apiClient
        .patch<
          ApiResponse<Project>
        >(`/api/workspaces/${workspaceId}/projects/${projectId}`, data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all(workspaceId),
      });
    },
  });
}
