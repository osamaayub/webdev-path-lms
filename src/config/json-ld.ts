import { course } from "@/content";
import { site } from "./site";

/** Course structured data for search engines. Rendered once in the root layout head. */
export const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: `${course.title}: zero to job-ready in 24 weeks`,
  description: site.description,
  url: site.url,
  provider: { "@type": "Person", name: site.author.name, url: site.author.url },
  isAccessibleForFree: true,
  educationalLevel: "Beginner",
  hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT12H/week" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", category: "Free" },
};

export const courseJsonLdHtml = JSON.stringify(courseJsonLd).replace(/</g, "\\u003c");
