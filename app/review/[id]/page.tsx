// Screen 4 — Write a review: a star picker, a comment box, a Submit button.
// Nothing else. On submit, the frontend hands three (or four) things to
// POST /api/reviews and steps back. The backend re-validates everything —
// frontend validation is kindness, backend validation is security.
import { Suspense } from "react";
import PeelLoader from "@/components/PeelLoader";
import ReviewForm from "./ReviewForm";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // The id is awaited inside the Suspense child, so the shell prerenders
  // instantly and the form streams in behind the peeling pineapple.
  return (
    <Suspense fallback={<PeelLoader label="Setting the table…" />}>
      <ReviewContent params={params} />
    </Suspense>
  );
}

async function ReviewContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewForm restaurantId={Number(id)} />;
}
