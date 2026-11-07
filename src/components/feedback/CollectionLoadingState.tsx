export function CollectionLoadingState() {
  return (
    <section role="status" className="flex flex-col gap-6">
      <p className="font-body text-body-sm text-muted">Loading your library…</p>

      <div
        aria-hidden="true"
        className="flex flex-col gap-6 animate-pulse motion-reduce:animate-none"
      >
        <div className="h-5 w-52.5 max-w-full rounded-sm bg-surface-elevated" />

        <div className="grid w-full max-w-175 grid-cols-2 gap-4 sm:grid-cols-4">
          {["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"].map((id) => (
            <div key={id} className="flex flex-col gap-3">
              <div className="aspect-163/218 rounded-[10px] bg-surface" />
              <div className="h-3.5 w-5/6 rounded-sm bg-surface-elevated" />
              <div className="h-3 w-1/2 rounded-sm bg-surface-elevated" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
