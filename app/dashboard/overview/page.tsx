import { PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import { getTransactionSummary } from "@/utils/AuthMethods/transactionMethods";
import { getServerAccessToken } from "@/utils/AuthMethods/serverToken";
import type { ChartDataPoint } from "@/app/_components/DataCharts/chart";
import ChartSwitcher from "@/app/_components/DataCharts/ChartSwitcher";
import CategoryPieChart, {
  type CategorySlice,
} from "@/app/_components/CategoryCharts/CategoryPieChart";
import OverviewCard from "./OverviewCard";

//percent change from previous to current; 0 when there is no prior baseline
function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

//placeholder daily series for the range until a time-series endpoint exists
function buildPlaceholderChartData(
  start: Date,
  days: number,
): ChartDataPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      income: 100 + (i % 7) * 40,
      expenses: 60 + (i % 5) * 30,
    };
  });
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

  const chartData = buildPlaceholderChartData(rangeStart, 30);

  //placeholder category breakdown until a per-category endpoint exists
  const categoryData: CategorySlice[] = [
    { name: "Rent", value: 1200 },
    { name: "Groceries", value: 460 },
    { name: "Transport", value: 180 },
    { name: "Dining", value: 240 },
    { name: "Utilities", value: 150 },
  ];

  return (
    <div className="pt-2 px-4 lg:px-5 -mt-16 relative z-10 pb-6">
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
