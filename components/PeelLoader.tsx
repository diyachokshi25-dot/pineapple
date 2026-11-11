// The official loader of this app: a pineapple being peeled like a banana.
// Pure CSS animation (defined in globals.css) — whimsical, as requested.
export default function PeelLoader({ label = "Peeling…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="peel-loader" aria-hidden="true">
        <div className="peel left" />
        <div className="peel right" />
        <div className="fruit" />
        <div className="crown" />
      </div>
      <p className="text-sm font-semibold text-leaf">{label}</p>
    </div>
  );
}
