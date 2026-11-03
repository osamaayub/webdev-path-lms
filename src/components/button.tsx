import Link from "next/link";

const styles = {
  primary: "bg-ink text-white hover:bg-[#22325a]",
  secondary: "border border-ink/20 bg-white text-ink hover:border-ink/40",
};

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: keyof typeof styles }) {
  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition-colors ${styles[variant]}`}>
      {children}
    </Link>
  );
}
