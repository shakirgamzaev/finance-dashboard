//loading fallback for SpendingInsightsCard, shown while the LLM call resolves
export default function SpendingInsightsCardSkeleton() {
  return (
    <div className="relative overflow-hidden h-48 rounded-xl shadow-sm bg-white">
      <div className="absolute top-0 left-0 w-[200%] h-full animate-shimmer bg-linear-to-b from-transparent via-gray-200 to-transparent" />
    </div>
  );
}
