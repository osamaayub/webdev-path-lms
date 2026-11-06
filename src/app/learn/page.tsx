import type { Metadata } from "next";
import { Badge, PageBar } from "@/components/page-parts";
import { allLessons, course } from "@/content";
import { introVideo } from "@/content/videos";
import { CourseProgress } from "@/features/progress/components/course-progress";
import { routeLines } from "@/features/route/to-lines";

export const metadata: Metadata = {
  title: "My course",
  description: "Your 24-week full-stack course: modules, progress and your next lesson.",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageBar trail={[{ label: "My course" }]} badge={<Badge>{allLessons.length} lessons · {course.totalWeeks} weeks</Badge>} />
      <CourseProgress lines={routeLines()} title={course.title} intro={{ href: `https://www.youtube.com/watch?v=${introVideo.id}`, title: introVideo.title }} />
    </div>
  );
}
