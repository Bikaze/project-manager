import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { fetchData, postData } from "@/lib/fetch-util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) => postData("/workspaces", data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchData("/workspaces"),
  });
};

export const useGetWorkspaceQuery = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
    enabled:
      !!workspaceId && workspaceId !== "null" && workspaceId !== "undefined",
  });
};

export const useGetWorkspaceStatsQuery = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
    enabled:
      !!workspaceId && workspaceId !== "null" && workspaceId !== "undefined",
  });
};

export const useGetWorkspaceDetailsQuery = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}`),
    enabled:
      !!workspaceId && workspaceId !== "null" && workspaceId !== "undefined",
  });
};

export const useInviteMemberMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; role: string; workspaceId: string }) =>
      postData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};

export const useAcceptInviteByTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) =>
      postData(`/workspaces/accept-invite-token`, {
        token,
      }),
  });
};

export const useAcceptGenerateInviteMutation = () => {
  return useMutation({
    mutationFn: (workspaceId: string) =>
      postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};

export const useGetWorkspaceArchivedProjectsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "archived", "projects"],
    queryFn: async () =>
      fetchData(`/workspaces/${workspaceId}/archived/projects`),
    enabled:
      !!workspaceId && workspaceId !== "null" && workspaceId !== "undefined",
  });
};

export const useGetWorkspaceArchivedTasksQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "archived", "tasks"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/archived/tasks`),
    enabled:
      !!workspaceId && workspaceId !== "null" && workspaceId !== "undefined",
  });
};

export const useUpdateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      workspaceId: string;
      name: string;
      description: string;
      color: string;
    }) =>
      postData(`/workspaces/${data.workspaceId}`, {
        name: data.name,
        description: data.description,
        color: data.color,
      }),
  });
};

export const useTransferWorkspaceOwnershipMutation = () => {
  return useMutation({
    mutationFn: async (data: { workspaceId: string; newOwnerId: string }) =>
      postData(`/workspaces/${data.workspaceId}/transfer-ownership`, {
        newOwnerId: data.newOwnerId,
      }),
  });
};

export const useDeleteWorkspaceMutation = () => {
  return useMutation({
    mutationFn: async (workspaceId: string) =>
      fetch(`${import.meta.env.VITE_API_URL}/workspaces/${workspaceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete workspace");
        }
        return res.json();
      }),
  });
};

export const useGetWorkspaceMembersQuery = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "members"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/members`),
    enabled:
      !!workspaceId && workspaceId !== "null" && workspaceId !== "undefined",
  });
};
