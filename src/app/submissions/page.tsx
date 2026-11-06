import type { Metadata } from "next";
import { Badge, HeaderCard, PageBar } from "@/components/page-parts";
import { projects } from "@/content";
import { MySubmissions } from "@/features/account/components/my-submissions";

export const metadata: Metadata = { title: "My submissions", description: "Your project submissions, grades and reviewer feedback.", robots: { index: false } };

export default function SubmissionsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageBar trail={[{ href: "/learn", label: "My course" }, { label: "My submissions" }]} badge={<Badge>{projects.length} projects</Badge>} />
      <HeaderCard icon="upload" title="My submissions" subtitle="Every module ends with a project. Submit your GitHub repo and live link, and a reviewer grades it out of 100." />
      <div className="mt-6">
        <MySubmissions projects={projects.map(({ slug, number, title, requirements }) => ({ slug, number, title, requirements }))} />
      </div>
    </div>
  );
}
