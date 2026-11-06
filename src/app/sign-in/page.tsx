import type { Metadata } from "next";
import { AuthPage } from "@/features/auth/components/auth-page";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with email, Google or GitHub to save your progress, take quizzes and submit projects for review.",
  robots: { index: false },
};

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return <AuthPage mode="sign-in" searchParams={searchParams} />;
}
