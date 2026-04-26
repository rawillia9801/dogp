import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in?error=confirm", url.origin));
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    return NextResponse.redirect(new URL("/sign-in?error=config", url.origin));
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const { data: verification } = await admin
    .from("email_verification_tokens")
    .select("id,user_id,email,expires_at,used_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!verification || verification.used_at || new Date(verification.expires_at).getTime() < Date.now()) {
    return NextResponse.redirect(new URL("/sign-in?error=confirm", url.origin));
  }

  await admin.auth.admin.updateUserById(verification.user_id, {
    email_confirm: true,
  });

  await admin
    .from("email_verification_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", verification.id);

  return NextResponse.redirect(new URL("/sign-in?notice=verified&email=" + encodeURIComponent(verification.email), url.origin));
}
