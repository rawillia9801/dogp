import type { Metadata } from "next";
import { AuthCallbackFinalizer } from "./auth-callback-finalizer";

export const metadata: Metadata = {
  title: "Confirming Account",
};

export default function AuthCallbackPage() {
  return <AuthCallbackFinalizer />;
}
