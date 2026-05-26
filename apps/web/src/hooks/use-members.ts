import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { WorkspaceMember, ApiResponse } from "@flowspace/types";

export function useMembers(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.members(workspaceId),
    queryFn: () =>
      apiClient
        .get<
          ApiResponse<WorkspaceMember[]>
        >(`/api/workspaces/${workspaceId}/members`)
        .then((r) => r.data),
    enabled: !!workspaceId,
  });
}

export function useRemoveMember(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      apiClient.delete(`/api/workspaces/${workspaceId}/members/${memberId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.members(workspaceId),
      });
    },
  });
}
