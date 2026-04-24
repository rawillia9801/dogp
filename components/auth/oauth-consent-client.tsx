"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Surface } from "@/components/ui/surface";

type ConsentState =
  | { status: "loading" }
  | {
      status: "ready";
      clientName: string;
      clientId: string;
      redirectUri: string;
      scopes: string[];
    }
  | { status: "error"; message: string };

type AuthorizationDetails =
  | {
      authorization_id: string;
      scope?: string;
      redirect_uri?: string;
      client?: {
        client_id?: string;
        name?: string;
      };
    }
  | {
      redirect_url?: string;
    };

export function OAuthConsentClient({ authorizationId }: { authorizationId: string }) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [state, setState] = useState<ConsentState>({ status: "loading" });
  const [submitting, setSubmitting] = useState<"approve" | "deny" | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAuthorization() {
      if (!supabase) {
        if (active) {
          setState({
            status: "error",
            message: "Supabase is not configured for OAuth consent yet.",
          });
        }
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(`/sign-in?next=${encodeURIComponent(`/oauth/consent?authorization_id=${authorizationId}`)}`);
        return;
      }

      const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);

      if (!active) {
        return;
      }

      if (error || !data) {
        setState({
          status: "error",
          message: error?.message ?? "We couldn't load the authorization request.",
        });
        return;
      }

      const details = data as AuthorizationDetails;

      if ("redirect_url" in details && details.redirect_url) {
        window.location.assign(details.redirect_url);
        return;
      }

      if (!("authorization_id" in details)) {
        setState({
          status: "error",
          message: "This authorization request is no longer available.",
        });
        return;
      }

      setState({
        status: "ready",
        clientName: details.client?.name ?? "Connected application",
        clientId: details.client?.client_id ?? "unknown-client",
        redirectUri: details.redirect_uri ?? "Redirect URI unavailable",
        scopes: (details.scope ?? "")
          .split(" ")
          .map((scope) => scope.trim())
          .filter(Boolean),
      });
    }

    void loadAuthorization();

    return () => {
      active = false;
    };
  }, [authorizationId, router, supabase]);

  async function handleDecision(action: "approve" | "deny") {
    if (!supabase) {
      setState({
        status: "error",
        message: "Supabase is not configured for OAuth consent yet.",
      });
      return;
    }

    setSubmitting(action);

    const method =
      action === "approve"
        ? supabase.auth.oauth.approveAuthorization
        : supabase.auth.oauth.denyAuthorization;

    const { data, error } = await method(authorizationId, { skipBrowserRedirect: true });

    if (error) {
      setSubmitting(null);
      setState({
        status: "error",
        message: error.message,
      });
      return;
    }

    if (data?.redirect_url) {
      window.location.assign(data.redirect_url);
      return;
    }

    setSubmitting(null);
    setState({
      status: "error",
      message: "The authorization request completed without a redirect target.",
    });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-app px-5 py-10 text-stone-100">
      <Surface className="w-full max-w-2xl overflow-hidden rounded-[26px] p-0">
        <div className="border-b border-white/[0.08] bg-[radial-gradient(circle_at_20%_15%,rgba(215,173,103,0.18),transparent_34%),linear-gradient(145deg,rgba(16,22,30,0.98),rgba(9,13,19,0.98))] px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">OAuth Authorization</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">Review app access</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-stone-400">
            Sign in once, review what this application is requesting, and approve only the access you want to share.
          </p>
        </div>

        <div className="space-y-5 p-6">
          {state.status === "loading" ? (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-sm text-stone-300">
              Loading authorization details...
            </div>
          ) : null}

          {state.status === "error" ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm leading-7 text-red-100">
              {state.message}
            </div>
          ) : null}

          {state.status === "ready" ? (
            <>
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Application</p>
                  <h2 className="mt-2 text-2xl font-semibold text-stone-50">{state.clientName}</h2>
                  <div className="mt-4 space-y-2 text-sm text-stone-400">
                    <p>
                      <span className="text-stone-200">Client ID:</span> {state.clientId}
                    </p>
                    <p className="break-all">
                      <span className="text-stone-200">Redirect URI:</span> {state.redirectUri}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gold/20 bg-gold/10 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/25 bg-black/10 text-gold">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-stone-50">This request uses your MyDogPortal account</p>
                  <p className="mt-2 text-sm leading-7 text-stone-300">
                    Your sign-in stays with Supabase Auth. This screen only approves the access requested by the connected app.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Requested access</p>
                {state.scopes.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {state.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs font-medium text-stone-200"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-stone-400">
                    No scopes were included with this authorization request.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handleDecision("approve")}
                  disabled={submitting !== null}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-[#15100a] transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting === "approve" ? "Approving..." : "Approve access"}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDecision("deny")}
                  disabled={submitting !== null}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.03] px-4 text-sm font-semibold text-stone-200 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting === "deny" ? "Declining..." : "Deny access"}
                  <X className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : null}
        </div>
      </Surface>
    </main>
  );
}
