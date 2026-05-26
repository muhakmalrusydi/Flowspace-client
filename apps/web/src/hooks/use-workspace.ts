import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Workspace, ApiResponse } from "@flowspace/types";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "@flowspace/validators";

export function useWorkspaces() {
  return useQuery({
    queryKey: queryKeys.workspaces.all(),
    queryFn: () =>
      apiClient
        .get<ApiResponse<Workspace[]>>("/api/workspaces")
        .then((r) => r.data),
  });
}

export function useWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.detail(workspaceId),
    queryFn: () =>
      apiClient
        .get<ApiResponse<Workspace>>(`/api/workspaces/${workspaceId}`)
        .then((r) => r.data),
    enabled: !!workspaceId,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) =>
      apiClient
        .post<ApiResponse<Workspace>>("/api/workspaces", data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all() });
    },
  });
}

export function useUpdateWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateWorkspaceInput) =>
      apiClient
        .patch<ApiResponse<Workspace>>(`/api/workspaces/${workspaceId}`, data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.detail(workspaceId),
      });
    },
  });
}
