import { createClient } from "@/lib/supabase/server";
import { SearchWorkspace } from "@/components/search-workspace";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!configured) return <SearchWorkspace configured={false} user={null} />;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <SearchWorkspace
      configured
      user={null}
    />
  );
}
