// src/app/(auth)/signup/page.tsx
import { requireUnauth } from "@/lib/auth-utils";
import { RegisterForm } from "@/features/auth/components/register-form";

export default async function SignupPage() {
  // If user is already logged in, redirect to /workflows
  await requireUnauth();

  return <RegisterForm />;
}