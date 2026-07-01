import { apiFetch, ApiError } from "@/lib/api/client";
import type { BranchDto } from "@/lib/api/types";
import { branches as seedBranches } from "@/content/seeds";

const TAG = "branches";

/** Active branches for the locator. Backend → seeds fallback. */
export async function listBranches(): Promise<BranchDto[]> {
  try {
    return await apiFetch<BranchDto[]>("/api/branches", {
      revalidate: 300,
      tags: [TAG],
    });
  } catch (err) {
    if (!(err instanceof ApiError) && !(err instanceof TypeError)) throw err;
    return seedBranches;
  }
}
