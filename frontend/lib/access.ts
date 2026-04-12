export const PACKAGE_TOOL_ACCESS: Record<string, string[]> = {
  starter: [
    "/dashboard",
    "/content-generator",
    "/ad-copy",
    "/weekly-plan",
    "/followup",
  ],
  growth: [
    "/dashboard",
    "/content-generator",
    "/ad-copy",
    "/weekly-plan",
    "/followup",
    "/lead-tracker",
    "/analytics",
    "/roi-calculator",
    "/client-report",
  ],
  agency: [
    "/dashboard",
    "/content-generator",
    "/ad-copy",
    "/weekly-plan",
    "/followup",
    "/lead-tracker",
    "/analytics",
    "/roi-calculator",
    "/client-report",
    "/competitor-research",
    "/proposal-generator",
    "/client-onboarding",
    "/demo-requests",
  ],
};

export function canAccessPath(role: string, packageName: string, path: string) {
  if (role === "admin") return true;

  const allowed = PACKAGE_TOOL_ACCESS[packageName] || [];
  return allowed.includes(path);
}