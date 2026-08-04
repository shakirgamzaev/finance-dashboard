"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/app/_components/DataTable/MainDataTable";
import MainNewTransactionView from "@/app/_components/NewTransactionView/MainNewTransaction";
import ShimmerCard from "@/app/_components/ShimmerCard";
import type { Account } from "@/app/models/account";
import type { Category } from "@/app/models/category";
import type { Transaction, TransactionRow } from "@/app/models/transaction";
import { getAccounts } from "@/utils/AuthMethods/accountMethods";
import { getCategories } from "@/utils/AuthMethods/categoryMethods";
import {
  deleteTransaction,
  deleteTransactions,
  getTransactions,
} from "@/utils/AuthMethods/transactionMethods";
import { getColumns } from "./columns";
import Header from "./Header";

export default function MainTransactionsPage() {
  const [isNewTransactionsOpened, setIsNewTransactionsOpened] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  //transaction being edited via the row actions menu; null means "create new" mode
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  //true only until the very first fetch finishes; background refetches don't touch it
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const loadTransactions = useCallback(async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadAccounts = useCallback(async () => {
    try {
      setAccounts(await getAccounts());
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await getCategories());
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    Promise.all([loadTransactions(), loadAccounts(), loadCategories()]).finally(
      () => setIsInitialLoading(false),
    );
  }, [loadTransactions, loadAccounts, loadCategories]);

  //resolve account/category ids to their names for display in the table
  const rows = useMemo<TransactionRow[]>(() => {
    const accountsById = new Map(accounts.map((a) => [a.id, a.name]));
    const categoriesById = new Map(categories.map((c) => [c.id, c.name]));
    return transactions.map((transaction) => ({
      ...transaction,
      accountName: accountsById.get(transaction.accountId) ?? "",
      categoryName:
        transaction.categoryId != null
          ? (categoriesById.get(transaction.categoryId) ?? "")
          : "",
    }));
  }, [transactions, accounts, categories]);

  const columns = useMemo(
    () =>
      getColumns(
        (transaction) => {
          setEditingTransaction(transaction);
          setIsNewTransactionsOpened(true);
        },
        async (transaction) => {
          setIsDeleting(true);
          try {
            await deleteTransaction(transaction.id);
            await loadTransactions();
          } catch (error) {
            console.error(error);
          } finally {
            setIsDeleting(false);
          }
        },
      ),
    [loadTransactions],
  );

  if (isInitialLoading) {
    return (
      <div className="flex justify-center">
        <ShimmerCard />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-2 px-2 items-center">
      <div className="flex flex-col w-full max-w-212.5 justify-center -mt-17.5 gap-6 p-6 rounded-[13px] shadow-[3px_3px_8px_rgba(0,0,0,0.12)] bg-white">
        <Header
          setNewTransactionsOpened={(value) => {
            setEditingTransaction(null);
            setIsNewTransactionsOpened(value);
          }}
        ></Header>
        <DataTable
          columns={columns}
          data={rows}
          filterColumn="payee"
          filterPlaceholder="payees..."
          disabled={isDeleting}
          onDelete={async (selectedRows) => {
            setIsDeleting(true);
            try {
              const ids = selectedRows.map((row) => row.original.id);
              await deleteTransactions(ids);
              await loadTransactions();
            } catch (error) {
              console.error(error);
            } finally {
              setIsDeleting(false);
            }
          }}
        ></DataTable>
      </div>
      <MainNewTransactionView
        isOpened={isNewTransactionsOpened}
        setIsOpened={setIsNewTransactionsOpened}
        accounts={accounts}
        categories={categories}
        onAccountCreated={loadAccounts}
        onCategoryCreated={loadCategories}
        onCreated={loadTransactions}
        onDeleted={loadTransactions}
        transaction={editingTransaction}
      />
    </div>
  );
}
