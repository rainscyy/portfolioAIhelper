import { useMutation } from "@tanstack/react-query";
import { api, type ExtractionRequest } from "@shared/routes";

export function useExtractData() {
  return useMutation({
    mutationFn: async (data: ExtractionRequest) => {
      const res = await fetch(api.ai.extract.path, {
        method: api.ai.extract.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to extract data");
      return api.ai.extract.responses[200].parse(await res.json());
    },
  });
}

export function useGenerateDescription() {
  return useMutation({
    mutationFn: async (data: { projectTitle: string; roughNotes: string }) => {
      const res = await fetch(api.ai.generateDescription.path, {
        method: api.ai.generateDescription.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to generate description");
      return api.ai.generateDescription.responses[200].parse(await res.json());
    },
  });
}
