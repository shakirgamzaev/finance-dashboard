"use client";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import ComboboxField, {
  type ComboboxOption,
} from "@/app/_components/ComboboxField";
import CustomButton from "@/app/_components/CustomButtons/CustomButton";
import { DataTable } from "@/app/_components/DataTable/MainDataTable";
import MainNewTransactionView from "@/app/_components/NewTransactionView/MainNewTransaction";
import ShimmerCard from "@/app/_components/ShimmerCard";
import { showToast } from "@/app/dashboard/ValtioStores/toastStore";
import type { Account } from "@/app/models/account";
import type { Category } from "@/app/models/category";
import type { Transaction, TransactionRow } from "@/app/models/transaction";
import { createAccount, getAccounts } from "@/utils/AuthMethods/accountMethods";
import {
  createCategory,
  getCategories,
} from "@/utils/AuthMethods/categoryMethods";
import {
  createTransaction,
  deleteTransaction,
  deleteTransactions,
  getTransactions,
} from "@/utils/AuthMethods/transactionMethods";
import { getColumns } from "./columns";
import Header from "./Header";
import type { CsvUpload } from "./uploadButton";
import { getCsvColumns } from "./utils/csvColumns";
import {
  assignField,
  buildCsvPayloads,
  type CsvField,
  type CsvMapping,
  missingRequiredFields,
  REQUIRED_CSV_FIELDS,
} from "./utils/csvImport";

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
  //parsed CSV file contents; non-null switches the page into import-preview mode
  const [csvUpload, setCsvUpload] = useState<CsvUpload | null>(null);
  //csv header -> payload field it fills; null means the column is skipped
  const [csvMapping, setCsvMapping] = useState<CsvMapping>({});
  //account/category the imported transactions are assigned to
  const [importAccount, setImportAccount] = useState<ComboboxOption | null>(
    null,
  );
  const [importCategory, setImportCategory] = useState<ComboboxOption | null>(
    null,
  );
  const [isImporting, setIsImporting] = useState(false);

  //assign a field to a header, unassigning it from any other header first
  const assignCsvField = useCallback(
    (header: string, field: CsvField | null) => {
      setCsvMapping((prev) => assignField(prev, header, field));
    },
    [],
  );

  const loadTransactions = useCallback(async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  //leave import-preview mode and clear all import state
  const resetCsvState = useCallback(() => {
    setCsvUpload(null);
    setCsvMapping({});
    setImportAccount(null);
    setImportCategory(null);
  }, []);

  //build payloads from the mapped columns and create the transactions
  async function importCsv() {
    if (csvUpload == null) return;
    if (importAccount == null) {
      showToast(<span>Please pick an account for the import</span>);
      return;
    }
    const result = buildCsvPayloads(
      csvUpload,
      csvMapping,
      importAccount.id,
      importCategory?.id ?? null,
    );
    if (!result.ok) {
      showToast(<span>{result.error}</span>);
      return;
    }

    setIsImporting(true);
    try {
      for (const payload of result.payloads) {
        await createTransaction(payload);
      }
      resetCsvState();
      await loadTransactions();
      showToast(
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSquareCheck} className="size-4" />
          <span>
            Imported {result.payloads.length} transaction
            {result.payloads.length === 1 ? "" : "s"}!
          </span>
        </div>,
      );
    } catch (error) {
      console.error(error);
      showToast(<span>Import failed, please try again</span>);
    } finally {
      setIsImporting(false);
    }
  }

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

  const csvColumns = useMemo(
    () => getCsvColumns(csvUpload?.headers ?? [], csvMapping, assignCsvField),
    [csvUpload, csvMapping, assignCsvField],
  );

  //everything still needed before the import can run; empty means ready
  const missingImportSteps = useMemo(() => {
    const missing = missingRequiredFields(csvMapping).map(
      (label) => `${label} column`,
    );
    if (importAccount == null) missing.unshift("Account");
    return missing;
  }, [csvMapping, importAccount]);

  const mappedRequiredCount =
    REQUIRED_CSV_FIELDS.length - missingRequiredFields(csvMapping).length;

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
          onCsvUploaded={(upload) => {
            resetCsvState();
            setCsvUpload(upload);
          }}
        ></Header>
        {csvUpload ? (
          <>
            <div className="flex flex-col lg:flex-row gap-3">
              <ComboboxField
                gap={3}
                label="Account (required)"
                value={importAccount}
                options={accounts}
                onSelect={setImportAccount}
                onCreate={async (name) => {
                  const created: Account = await createAccount(name);
                  await loadAccounts();
                  return created;
                }}
                placeholderText="Account for imported transactions"
              />
              <ComboboxField
                gap={3}
                label="Category (optional)"
                value={importCategory}
                options={categories}
                onSelect={setImportCategory}
                onCreate={async (name) => {
                  const created: Category = await createCategory(name);
                  await loadCategories();
                  return created;
                }}
                placeholderText="Category for imported transactions"
              />
            </div>
            <DataTable
              columns={csvColumns}
              data={csvUpload.rows}
              onDelete={() => {}}
            ></DataTable>
            <div className="flex flex-col gap-1">
              <p className="text-[0.8rem] text-gray-500">
                Click a column header to choose which transaction field it
                fills; columns left on "Skip" are not imported.
              </p>
              <p
                className={`text-[0.8rem] font-medium ${
                  mappedRequiredCount === REQUIRED_CSV_FIELDS.length
                    ? "text-green-600"
                    : "text-gray-700"
                }`}
              >
                {mappedRequiredCount}/{REQUIRED_CSV_FIELDS.length} required
                columns mapped
                {missingImportSteps.length > 0 && (
                  <span className="font-normal text-gray-500">
                    {" "}
                    — still select: {missingImportSteps.join(", ")}
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
              <CustomButton
                handler={importCsv}
                label="Import"
                backgroundColor="bg-addAccount"
                disabled={isImporting || missingImportSteps.length > 0}
                extraCSS="lg:w-auto"
              />
              <CustomButton
                handler={resetCsvState}
                label="Cancel import"
                backgroundColor="bg-red-600"
                disabled={isImporting}
                extraCSS="lg:w-auto"
              />
            </div>
          </>
        ) : (
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
        )}
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
