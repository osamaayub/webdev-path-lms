import type { Metadata } from "next";
import { CourseProgress } from "@/features/progress/components/course-progress";
import { routeLines } from "@/features/route/to-lines";

export const metadata: Metadata = {
  title: "My progress",
  description: "See where you are on the 24-week route and continue from your next stop.",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">My progress</h1>
      <p className="mt-2 text-muted">Pass a week&apos;s quiz to complete it. Saved to your account.</p>
      <div className="mt-10"><CourseProgress lines={routeLines()} /></div>
    </div>
  );
}
