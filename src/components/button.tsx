import Link from "next/link";

const styles = {
  primary: "btn-primary",
  secondary: "btn-secondary",
};

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: keyof typeof styles }) {
  return (
    <Link href={href} className={styles[variant]}>
      {children}
    </Link>
  );
}
