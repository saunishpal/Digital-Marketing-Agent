import { Suspense } from "react";
import ClientOnboardingContent from "./ClientOnboardingContent";

export default function ClientOnboardingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading...</div>}>
      <ClientOnboardingContent />
    </Suspense>
  );
}
