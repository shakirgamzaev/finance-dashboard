import { Sparkles } from "lucide-react";
import type { SpendingInsight } from "@/app/models/transaction";
import { getSpendingInsights } from "@/utils/AuthMethods/transactionMethods";

const SEVERITY_STYLES: Record<
  SpendingInsight["flags"][number]["severity"],
  string
> = {
  high: "bg-red-500/10 text-red-700",
  medium: "bg-amber-500/10 text-amber-700",
  low: "bg-gray-500/10 text-gray-700",
};

type Props = {
  start: Date;
  end: Date;
  token?: string;
};

export default async function SpendingInsightsCard({
  start,
  end,
  token,
}: Props) {
  const insight = await getSpendingInsights(start, end, token);

  return (
    <div className="p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="size-4 text-blue-700" />
        <h1 className="text-xl font-bold">Spending Insights</h1>
        <span className="text-[11px] text-gray-400">AI-generated</span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {insight.flags.map((flag) => (
          <div
            key={`${flag.severity}-${flag.text}`}
            className="flex items-center gap-2"
          >
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${SEVERITY_STYLES[flag.severity]}`}
            >
              {flag.severity}
            </span>
            <p className="text-[13px] text-gray-700">{flag.text}</p>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-blue-50 text-[13px] text-blue-900">
        {insight.suggestion}
      </div>
    </div>
  );
}
