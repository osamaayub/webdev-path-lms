import type { Metadata } from "next";
import { AuthPage } from "@/features/auth/components/auth-page";

export const metadata: Metadata = {
  title: "Create your free account",
  description: "Sign up free with email, Google or GitHub to save your progress, take the weekly quizzes and get your projects reviewed.",
};

export default function SignUpPage({ searchParams }: PageProps<"/sign-up">) {
  return <AuthPage mode="sign-up" searchParams={searchParams} />;
}
