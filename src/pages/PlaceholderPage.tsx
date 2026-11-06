type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section>
      <h1 className="font-display text-heading-1 font-bold">{title}</h1>

      <p className="mt-2 font-body text-muted">{description}</p>
    </section>
  );
}
