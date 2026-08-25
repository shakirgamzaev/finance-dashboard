import { PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import {
  getExpensesByCategory,
  getTransactionSeries,
  getTransactionSummary,
} from "@/utils/AuthMethods/transactionMethods";
import { getServerAccessToken } from "@/utils/AuthMethods/serverToken";
import ChartSwitcher from "@/app/_components/DataCharts/ChartSwitcher";
import CategoryPieChart from "@/app/_components/CategoryCharts/CategoryPieChart";
import OverviewCard from "./OverviewCard";

//percent change from previous to current; 0 when there is no prior baseline
function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

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

  //previous period: same length, immediately before the current range
  const prevEnd = rangeStart;
  const prevStart = new Date(
    rangeStart.getTime() - (rangeEnd.getTime() - rangeStart.getTime()),
  );

  const token = await getServerAccessToken();
  const [summary, prevSummary, chartData, categoryData] = await Promise.all([
    getTransactionSummary(rangeStart, rangeEnd, token),
    getTransactionSummary(prevStart, prevEnd, token),
    getTransactionSeries(rangeStart, rangeEnd, token),
    getExpensesByCategory(rangeStart, rangeEnd, token),
  ]);

  return (
    <div className="pt-2 px-4 lg:px-5 -mt-7 relative z-10 pb-6 lg:-mt-11">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          percentageChange={percentChange(
            summary.expenses,
            prevSummary.expenses,
          )}
          icon={<TrendingDown className="size-4  text-gray-700" />}
          iconWrapperClassName="bg-blue-200"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <section className="lg:col-span-3 p-4 rounded-xl shadow-sm">
          <ChartSwitcher data={chartData} />
        </section>
        <section className="p-4 rounded-xl shadow-sm">
          <h1 className="text-xl font-bold mb-4">Categories</h1>
          <CategoryPieChart data={categoryData} />
        </section>
      </div>
    </div>
  );
}
