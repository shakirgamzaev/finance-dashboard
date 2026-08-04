//json models returned by the fastapi backend

//matches the TransactionRead pydantic model (/transactions endpoints)
export type Transaction = {
  userId: number;
  id: number;
  accountId: number;
  categoryId: number | null;
  payee: string;
  //amount in the account's currency (e.g. dollars), negative for outflows
  amount: number;
  notes: string | null;
};

//payload sent when creating or updating a transaction
export type TransactionPayload = {
  accountId: number;
  categoryId: number | null;
  payee: string;
  amount: number;
  notes: string | null;
};

//transaction enriched with the resolved account/category names for display
export type TransactionRow = Transaction & {
  accountName: string;
  categoryName: string;
};
