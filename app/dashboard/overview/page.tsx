import { Suspense } from "react";
import { getServerAccessToken } from "@/utils/AuthMethods/serverToken";
import SpendingInsightsCard from "@/app/_components/SpendingInsights/SpendingInsightsCard";
import SpendingInsightsCardSkeleton from "@/app/_components/SpendingInsights/SpendingInsightsCardSkeleton";
import OverviewFastData from "./OverviewFastData";
import OverviewFastDataSkeleton from "./OverviewFastDataSkeleton";

//parses YYYY-MM-DD at local midnight; undefined if missing/invalid
function parseDateParam(value: string | undefined): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function MainOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;

  //default range: last 30 days ending today
  const parsedFrom = parseDateParam(from);
  const parsedTo = parseDateParam(to);
  const rangeEnd = parsedTo ?? new Date();
  let rangeStart: Date;
  if (parsedFrom) {
    rangeStart = parsedFrom;
  } else {
    rangeStart = new Date(rangeEnd);
    rangeStart.setMonth(rangeStart.getMonth() - 1);
  }

  const token = await getServerAccessToken();
  //changing this key on a Suspense boundary forces it to re-suspend and show its
  //fallback again instead of silently swapping stale content for new content
  const rangeKey = `${rangeStart.toISOString()}_${rangeEnd.toISOString()}`;

  return (
    <div className="pt-2 px-4 lg:px-5 -mt-7 relative z-10 pb-6 lg:-mt-11">
      <Suspense key={rangeKey} fallback={<OverviewFastDataSkeleton />}>
        <OverviewFastData
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          token={token}
        />
      </Suspense>

      <div className="mt-6">
        <Suspense key={rangeKey} fallback={<SpendingInsightsCardSkeleton />}>
          <SpendingInsightsCard
            start={rangeStart}
            end={rangeEnd}
            token={token}
          />
        </Suspense>
      </div>
    </div>
  );
}
