import { PageIntro, SiteShell } from "./site-shell";
import type { ReactNode } from "react";

export function InfoPage({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <SiteShell>
      <PageIntro eyebrow={eyebrow} title={title} text={text} />
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">{children}</div>
    </SiteShell>
  );
}

export function SectionHeading({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-extrabold uppercase text-primary">{label}</p>
      <h2 className="mt-3 font-display text-3xl uppercase sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 leading-7 text-muted-foreground">{text}</p>}
    </div>
  );
}
