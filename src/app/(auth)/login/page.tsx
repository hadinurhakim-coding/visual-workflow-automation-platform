// src/app/(auth)/login/page.tsx
import { requireUnauth } from "@/lib/auth-utils";
import { LoginForm } from "@/features/auth/components/login-form";
import Link from "next/link";

export default async function LoginPage() {
  // If user is already logged in, redirect to /workflows
  await requireUnauth();

  return (
    <div>
      <LoginForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
          Sign up
        </Link>
      </p>
    </div>
  );
}