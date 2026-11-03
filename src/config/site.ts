function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "WebDev Path",
  title: "WebDev Path | Free 24-Week Full-Stack Web Development Course",
  description:
    "A free, project-based course from zero to job-ready full-stack developer: HTML, CSS, JavaScript, React, Next.js, Node.js, databases and AI, with 6 portfolio projects.",
  url: siteUrl(),
  author: { name: "Osama Ayub", url: "https://osama-ayubpersonal.vercel.app/" },
  repo: "https://github.com/osamaayub/webdev-path-lms",
  youtube: "https://www.youtube.com/@osamaayubdev",
};
