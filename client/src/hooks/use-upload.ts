import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(api.upload.create.path, {
        method: api.upload.create.method,
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      return api.upload.create.responses[200].parse(await res.json());
    },
  });
}
