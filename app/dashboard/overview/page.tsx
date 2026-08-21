import { PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import { getTransactionSummary } from "@/utils/AuthMethods/transactionMethods";
import { getServerAccessToken } from "@/utils/AuthMethods/serverToken";
import OverviewCard from "./OverviewCard";

//percent change from previous to current; 0 when there is no prior baseline
function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export default async function MainOverviewPage() {
  const rangeEnd = new Date();
  const rangeStart = new Date(rangeEnd);
  rangeStart.setMonth(rangeStart.getMonth() - 1);

  //previous period: the month immediately before the current range
  const prevEnd = rangeStart;
  const prevStart = new Date(prevEnd);
  prevStart.setMonth(prevStart.getMonth() - 1);

  const token = await getServerAccessToken();
  const [summary, prevSummary] = await Promise.all([
    getTransactionSummary(rangeStart, rangeEnd, token),
    getTransactionSummary(prevStart, prevEnd, token),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2 px-4 lg:px-5 -mt-16 relative z-10 pb-6">
      <OverviewCard
        title="Remaining"
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        amount={summary.remaining}
        percentageChange={percentChange(
          summary.remaining,
          prevSummary.remaining,
        )}
        icon={<PiggyBank className="size-4 text-blue-900 fill-blue-900" />}
        iconWrapperClassName="bg-blue-200"
      />
      <OverviewCard
        title="Income"
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        amount={summary.income}
        percentageChange={percentChange(summary.income, prevSummary.income)}
        icon={<TrendingUp className="size-4 text-gray-700" />}
        iconWrapperClassName="bg-blue-200"
      />
      <OverviewCard
        title="Expenses"
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        amount={summary.expenses}
        percentageChange={percentChange(summary.expenses, prevSummary.expenses)}
        icon={<TrendingDown className="size-4  text-gray-700" />}
        iconWrapperClassName="bg-blue-200"
      />
    </div>
  );
}
