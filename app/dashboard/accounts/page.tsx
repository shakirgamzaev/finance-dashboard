"use client";
import { useCallback, useEffect, useState } from "react";
import MainNewAccountView from "@/app/_components/NewAccountView/MainNewAccount";
import ShimmerCard from "@/app/_components/ShimmerCard";
import type { Account } from "@/app/models/account";
import {
  deleteAccounts,
  getAccounts,
} from "@/utils/AuthMethods/accountMethods";
import Header from "./Header";
import { columns } from "./columns";
import { DataTable } from "@/app/_components/DataTable/MainDataTable";

export default function MainAccountsPage() {
  const [isNewAccountsOpened, setIsNewAccountsOpened] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  //true only until the very first fetch finishes; background refetches don't touch it
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const loadAccounts = useCallback(async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

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
        <Header setNewAccountsOpened={setIsNewAccountsOpened}></Header>
        <DataTable
          columns={columns}
          data={accounts}
          filterColumn="name"
          filterPlaceholder="names..."
          disabled={isDeleting}
          onDelete={async (rows) => {
            setIsDeleting(true);
            try {
              const ids = rows.map((row) => row.original.id);
              await deleteAccounts(ids);
              await loadAccounts();
            } catch (error) {
              console.error(error);
            } finally {
              setIsDeleting(false);
            }
          }}
        ></DataTable>
      </div>
      <MainNewAccountView
        isOpened={isNewAccountsOpened}
        setIsOpened={setIsNewAccountsOpened}
        onCreated={loadAccounts}
      />
    </div>
  );
}
