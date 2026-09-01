//shimmer block; keys are stable labels (not indices) since these are static placeholders
const CARD_LABELS = ["remaining", "income", "expenses"];

function ShimmerBlock({ className }: { className: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-sm bg-white ${className}`}
    >
      <div className="absolute top-0 left-0 w-[200%] h-full animate-shimmer bg-linear-to-b from-transparent via-gray-200 to-transparent" />
    </div>
  );
}

//loading fallback for OverviewFastData, shown while the date range's SQL queries resolve
export default function OverviewFastDataSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {CARD_LABELS.map((label) => (
          <ShimmerBlock key={label} className="h-32" />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ShimmerBlock className="lg:col-span-3 h-75" />
        <ShimmerBlock className="h-75" />
      </div>
    </>
  );
}
