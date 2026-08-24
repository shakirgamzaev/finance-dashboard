"use client";

type TooltipEntry = {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string | number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
};

//formats an ISO date at local midnight as e.g. "May 9, 2025"
function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const income = Number(
    payload.find((e) => e.dataKey === "income")?.value ?? 0,
  );
  //expenses may arrive as a magnitude or a negative; normalize to magnitude
  const expenses = Math.abs(
    Number(payload.find((e) => e.dataKey === "expenses")?.value ?? 0),
  );
  const net = income - expenses;

  return (
    <div className="rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden">
      <p className="text-[12px] font-medium text-gray-900 bg-gray-100 px-3 py-2 mb-2">
        {formatDate(String(label))}
      </p>
      <div className="flex flex-col gap-1 px-3 pb-2">
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="text-[12px] capitalize"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.dataKey === "expenses" ? "-" : ""}
            {Math.abs(Number(entry.value)).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        ))}
        <p
          className={`text-[12px] font-medium ${net >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          Net: {net >= 0 ? "+" : "-"}
          {Math.abs(net).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
    </div>
  );
}
