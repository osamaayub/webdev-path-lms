import type { Metadata } from "next";
import { HeaderCard, PageBar } from "@/components/page-parts";
import { allLessons, course, lessonId, projects } from "@/content";
import { Certificate } from "@/features/account/components/certificate";

export const metadata: Metadata = { title: "Certificate", description: "Earn a certificate of completion by passing every week and getting all six projects approved.", robots: { index: false } };

export default function CertificatePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageBar trail={[{ href: "/learn", label: "My course" }, { label: "Certificate" }]} />
      <HeaderCard icon="award" title="Certificate" subtitle="Pass all 24 weekly quizzes and get all 6 projects approved by a reviewer." />
      <div className="mt-6">
        <Certificate lessonIds={allLessons.map(lessonId)} projectSlugs={projects.map((p) => p.slug)} course={course.title} />
      </div>
    </div>
  );
}
