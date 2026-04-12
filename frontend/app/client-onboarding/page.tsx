import ClientOnboardingClient from "@/components/ClientOnboardingClient";

type SearchParams = {
  demo_id?: string;
  business_name?: string;
  niche?: string;
  city?: string;
  whatsapp?: string;
  services?: string;
};

export default async function ClientOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  return <ClientOnboardingClient searchParams={params} />;
}
