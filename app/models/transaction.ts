//json models returned by the fastapi backend

//matches the TransactionRead pydantic model (/transactions endpoints)
export type Transaction = {
  userId: string;
  id: string;
  accountId: number;
  categoryId: number | null;
  payee: string;
  //amount in the account's currency (e.g. dollars), negative for outflows
  amount: number;
  notes: string | null;
  //ISO date string (YYYY-MM-DD) of when the transaction occurred
  date: string;
};

//payload sent when creating or updating a transaction
export type TransactionPayload = {
  accountId: number;
  categoryId: number | null;
  payee: string;
  amount: number;
  notes: string | null;
  date: string;
};

//transaction enriched with the resolved account/category names for display
export type TransactionRow = Transaction & {
  accountName: string;
  categoryName: string;
};

//matches the TransactionSummary pydantic model (/transactions/summary endpoint)
export type TransactionSummary = {
  //sum of positive transaction amounts in the range
  income: number;
  //sum of negative transaction amounts (<= 0) in the range
  expenses: number;
  //income + expenses (income minus absolute expenses)
  remaining: number;
};

//matches TransactionSeriesPoint (/transactions/series endpoint); one point per day
export type TransactionSeriesPoint = {
  //ISO date string (YYYY-MM-DD)
  date: string;
  income: number;
  //positive magnitude
  expenses: number;
};

//matches CategoryExpense (/transactions/categories endpoint)
export type CategoryExpense = {
  name: string;
  //positive magnitude spent in the category
  value: number;
};

//matches FlagsInsight pydantic model
export type FlagsInsight = {
  text: string;
  severity: "high" | "medium" | "low";
};

//matches SpendingInsight pydantic model (/insight endpoint)
export type SpendingInsight = {
  flags: FlagsInsight[];
  suggestion: string;
};
