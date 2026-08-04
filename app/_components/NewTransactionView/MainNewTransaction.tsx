"use client";
import { faSquareCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { showToast } from "@/app/dashboard/ValtioStores/toastStore";
import type { Account } from "@/app/models/account";
import type { Category } from "@/app/models/category";
import type { Transaction } from "@/app/models/transaction";
import { createAccount } from "@/utils/AuthMethods/accountMethods";
import { createCategory } from "@/utils/AuthMethods/categoryMethods";
import {
  createTransaction,
  deleteTransaction as deleteTransactionRequest,
  updateTransaction,
} from "@/utils/AuthMethods/transactionMethods";
import ComboboxField, { type ComboboxOption } from "../ComboboxField";
import CrossMark from "../CrossMark";
import CustomButton from "../CustomButtons/CustomButton";
import InputField from "../InputField";

export default function MainNewTransactionView({
  isOpened,
  setIsOpened,
  accounts,
  categories,
  onAccountCreated,
  onCategoryCreated,
  onCreated,
  onDeleted,
  transaction,
}: {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  accounts: Account[];
  categories: Category[];
  //refresh the account/category lists after one is created inline
  onAccountCreated?: () => void;
  onCategoryCreated?: () => void;
  onCreated?: () => void;
  onDeleted?: () => void;
  transaction?: Transaction | null;
}) {
  const isEditing = transaction != null;
  const [account, setAccount] = useState<ComboboxOption | null>(null);
  const [category, setCategory] = useState<ComboboxOption | null>(null);
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  //prefill on open (edit mode) and keep values during the close animation
  useEffect(() => {
    if (isOpened) {
      setAccount(accounts.find((a) => a.id === transaction?.accountId) ?? null);
      setCategory(
        categories.find((c) => c.id === transaction?.categoryId) ?? null,
      );
      setPayee(transaction?.payee ?? "");
      setAmount(transaction != null ? String(transaction.amount) : "");
      setNotes(transaction?.notes ?? "");
    }
  }, [isOpened, transaction, accounts, categories]);

  //keep only digits, a single decimal point and an optional leading minus
  function handleAmountChange(value: string) {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const normalized = cleaned
      .replace(/(?!^)-/g, "")
      .replace(/(\..*)\./g, "$1");
    setAmount(normalized);
  }

  //format to two decimals as a currency value when the field loses focus
  function handleAmountBlur() {
    if (amount.trim() === "" || amount === "-") return;
    const parsed = Number(amount);
    if (Number.isNaN(parsed)) return;
    setAmount(parsed.toFixed(2));
  }

  async function saveTransaction() {
    if (account == null) {
      showToast(
        <div className="flex items-center gap-2">
          <span>Please pick an account first</span>
        </div>,
      );
      return;
    }
    setIsProcessing(true);
    try {
      const payload = {
        accountId: account.id,
        categoryId: category?.id ?? null,
        payee,
        amount: Number(amount) || 0,
        notes: notes.trim() === "" ? null : notes,
      };
      if (isEditing) {
        await updateTransaction(transaction.id, payload);
      } else {
        await createTransaction(payload);
      }
      setIsOpened(false);
      onCreated?.();
      showToast(
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSquareCheck} className="size-4" />
          <span>
            {isEditing ? "Transaction updated!" : "Transaction created!"}
          </span>
        </div>,
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function deleteTransaction() {
    if (!isEditing) return;
    setIsProcessing(true);
    try {
      await deleteTransactionRequest(transaction.id);
      setIsOpened(false);
      onDeleted?.();
      showToast(
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSquareCheck} className="size-4" />
          <span>Transaction deleted!</span>
        </div>,
      );
    } finally {
      setIsProcessing(false);
    }
  }

  //create a new account inline from the combobox and refresh the list
  async function createAccountOption(name: string): Promise<ComboboxOption> {
    const created: Account = await createAccount(name);
    onAccountCreated?.();
    return created;
  }

  //create a new category inline from the combobox and refresh the list
  async function createCategoryOption(name: string): Promise<ComboboxOption> {
    const created: Category = await createCategory(name);
    onCategoryCreated?.();
    return created;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        onClick={() => setIsOpened(false)}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
          isOpened ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed right-0 top-0 z-10 h-dvh w-full max-w-125 bg-white text-black shadow-xl transition-transform duration-300 ease-in-out p-4 ${
          isOpened ? "translate-x-0" : "translate-x-full"
        } grid grid-cols-1 auto-rows-min gap-y-2`}
      >
        <div className="flex justify-between">
          <h2 className="font-bold">
            {isEditing ? "Edit Transaction" : "New Transaction"}
          </h2>
          <CrossMark size={15} onClick={() => setIsOpened(false)} />
        </div>
        <p className="text-[0.8rem] text-gray-500 justify-self-start">
          {isEditing
            ? "Edit the details of your transaction"
            : "Add a new transaction to track your spending"}
        </p>

        <ComboboxField
          gap={3}
          label="Account"
          value={account}
          options={accounts}
          onSelect={setAccount}
          onCreate={createAccountOption}
          placeholderText="Select an account"
          extraCSS="mt-2"
        />

        <ComboboxField
          gap={3}
          label="Category"
          value={category}
          options={categories}
          onSelect={setCategory}
          onCreate={createCategoryOption}
          placeholderText="Select a category"
        />

        <InputField
          gap={3}
          label="Payee"
          type="text"
          value={payee}
          onChange={setPayee}
          placeholderText="Add a payee"
        />

        <div style={{ gap: "3px" }} className="flex flex-col w-full">
          <p className="text-[0.78rem] md:text-[0.9rem]">Amount</p>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            placeholder="0.00"
            onChange={(e) => handleAmountChange(e.target.value)}
            onBlur={handleAmountBlur}
            className="rounded-md p-1 border-[1.4px] border-[rgba(0,0,0,0.1)] shadow-xs text-[14px]"
          />
        </div>

        <InputField
          gap={3}
          label="Notes"
          type="text"
          value={notes}
          onChange={setNotes}
          placeholderText="Optional notes"
        />

        <CustomButton
          handler={saveTransaction}
          backgroundColor="bg-addAccount"
          label={isEditing ? "Save Changes" : "Create Transaction"}
          disabled={isProcessing}
        ></CustomButton>

        {isEditing && (
          <CustomButton
            handler={deleteTransaction}
            backgroundColor="bg-red-600"
            disabled={isProcessing}
            label={
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faTrash} className="size-3.5" />
                <span>Delete Transaction</span>
              </div>
            }
          ></CustomButton>
        )}
      </div>
    </>
  );
}
