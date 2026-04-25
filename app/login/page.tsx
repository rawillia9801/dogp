import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/sign-in?next=%2Fdashboard");
}