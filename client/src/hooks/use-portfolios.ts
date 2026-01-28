import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertPortfolio, type UpdatePortfolioRequest } from "@shared/routes";

// GET /api/portfolios/:id
export function usePortfolio(id: number) {
  return useQuery({
    queryKey: [api.portfolios.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.portfolios.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      return api.portfolios.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/portfolios
export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPortfolio) => {
      const res = await fetch(api.portfolios.create.path, {
        method: api.portfolios.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create portfolio");
      return api.portfolios.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate get query potentially
      queryClient.setQueryData([api.portfolios.get.path, data.id], data);
    },
  });
}

// PUT /api/portfolios/:id
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdatePortfolioRequest) => {
      const url = buildUrl(api.portfolios.update.path, { id });
      const res = await fetch(url, {
        method: api.portfolios.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update portfolio");
      return api.portfolios.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.portfolios.get.path, data.id] });
    },
  });
}
