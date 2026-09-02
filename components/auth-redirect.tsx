"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function AuthRedirect() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    void (async () => {
      const supabase = createClient();
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const oauthError = params.get("error_description") || params.get("error");

      if (oauthError) {
        if (active) setMessage(`Google sign-in failed: ${oauthError}`);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      if (!code) return;
      if (active) setMessage("Finishing Google sign-in…");

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        if (active) setMessage(`Google sign-in failed: ${error.message}`);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    })();

    return () => { active = false; };
  }, [router]);

  return message ? <div className="auth-message" role="status">{message}</div> : null;
}
