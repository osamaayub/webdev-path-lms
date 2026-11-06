import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Badge, HeaderCard, PageBar } from "@/components/page-parts";
import { site } from "@/config/site";
import { allLessons, lessonId } from "@/content";
import { videos } from "@/content/videos";

export const metadata: Metadata = {
  title: "Video lessons",
  description: "Free video lessons for the WebDev Path course: Next.js 16, React hooks, Node.js APIs, the OpenAI API and AI chatbots.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageBar trail={[{ href: "/learn", label: "My course" }, { label: "Video lessons" }]} badge={<Badge>{videos.length} videos</Badge>} />
      <HeaderCard icon="video" title="Video lessons" subtitle="Short, practical videos that go with the weekly lessons. Each one opens inside its lesson, next to the quiz.">
        <a href={site.youtube} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-4 !py-2 text-[15px]">Subscribe on YouTube <Icon name="external" size={14} /></a>
      </HeaderCard>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => {
          const lesson = v.lessonId ? allLessons.find((l) => lessonId(l) === v.lessonId) : undefined;
          const href = lesson ? `/learn/${lesson.phase.slug}/${lesson.slug}` : `https://www.youtube.com/watch?v=${v.id}`;
          const external = !lesson;
          return (
            <li key={v.id}>
              <Link href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="panel group block overflow-hidden hover:border-brand/50">
                <span className="relative block aspect-video bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail, allowed by CSP */}
                  <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 group-hover:opacity-100" />
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-0.5 text-[13px] text-white">{v.minutes} min</span>
                </span>
                <span className="block p-4">
                  <span className="block font-semibold leading-snug">{v.title}</span>
                  <span className="mt-1 block text-[14px] text-muted">{lesson ? `Week ${lesson.week}: ${lesson.title}` : "Course intro"}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
