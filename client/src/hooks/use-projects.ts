import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertProject, type UpdateProjectRequest } from "@shared/routes";

// POST /api/portfolios/:portfolioId/projects
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ portfolioId, ...data }: InsertProject & { portfolioId: number }) => {
      const url = buildUrl(api.projects.create.path, { portfolioId });
      const res = await fetch(url, {
        method: api.projects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create project");
      return api.projects.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate the portfolio query since it includes projects
      queryClient.invalidateQueries({ queryKey: [api.portfolios.get.path, variables.portfolioId] });
    },
  });
}

// PUT /api/projects/:id
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, portfolioId, ...updates }: { id: number; portfolioId: number } & UpdateProjectRequest) => {
      const url = buildUrl(api.projects.update.path, { id });
      const res = await fetch(url, {
        method: api.projects.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update project");
      return api.projects.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.portfolios.get.path, variables.portfolioId] });
    },
  });
}

// DELETE /api/projects/:id
export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, portfolioId }: { id: number; portfolioId: number }) => {
      const url = buildUrl(api.projects.delete.path, { id });
      const res = await fetch(url, {
        method: api.projects.delete.method,
      });
      if (!res.ok) throw new Error("Failed to delete project");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.portfolios.get.path, variables.portfolioId] });
    },
  });
}
