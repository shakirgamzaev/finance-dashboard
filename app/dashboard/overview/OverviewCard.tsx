import type { ReactNode } from "react";

type CardProps = {
  title: string;
  rangeStart: Date;
  rangeEnd: Date;
  amount: number;
  percentageChange: number;
  icon: ReactNode;
  iconWrapperClassName?: string;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDateRange(rangeStart: Date, rangeEnd: Date): string {
  const startMonth = MONTHS[rangeStart.getMonth()];
  const startDay = rangeStart.getDate();
  const endMonth = MONTHS[rangeEnd.getMonth()];
  const endDay = rangeEnd.getDate();
  const endYear = rangeEnd.getFullYear();

  const start = `${startMonth},${startDay}`;
  const end = `${endMonth},${endDay}`;

  // Year spillover (e.g. Dec -> Jan): show the year on both ends.
  if (rangeStart.getFullYear() !== endYear) {
    return `${start} ${rangeStart.getFullYear()} - ${end} ${endYear}`;
  }

  return `${start} - ${end} ${endYear}`;
}

export default function OverviewCard(props: CardProps) {
  return (
    <div className="w-full p-4 flex flex-col items-start gap-5  rounded-xl shadow-sm max-w-[600px] mx-auto bg-white">
      <div className="flex w-full justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">{props.title}</h1>
          <p className="text-[12px] text-gray-500">
            {formatDateRange(props.rangeStart, props.rangeEnd)}
          </p>
        </div>
        <div
          className={`p-2 rounded-lg ${props.iconWrapperClassName ?? "bg-gray-100"}`}
        >
          {props.icon}
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold">
          {props.amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </h1>
        <p className="text-[12px] text-gray-500">{`${props.percentageChange}% from last period`}</p>
      </div>
    </div>
  );
}
