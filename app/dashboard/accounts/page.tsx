"use client";
import { useCallback, useEffect, useState } from "react";
import MainNewAccountView from "@/app/_components/NewAccountView/MainNewAccount";
import type { Account } from "@/app/models/account";
import { getAccounts } from "@/utils/AuthMethods/accountMethods";
import Header from "./Header";
import { columns, type Payment } from "./columns";
import { DataTable } from "@/app/_components/DataTable/MainDataTable";

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
];

export default function MainAccountsPage() {
  const [isNewAccountsOpened, setIsNewAccountsOpened] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const loadAccounts = useCallback(async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return (
    <div className="flex flex-col gap-4 pt-2 px-2 items-center">
      <div className="flex flex-col w-full max-w-212.5 justify-center -mt-17.5 gap-4 p-2 rounded-[13px] shadow-[3px_3px_8px_rgba(0,0,0,0.12)] bg-white">
        <Header setNewAccountsOpened={setIsNewAccountsOpened}></Header>
        <DataTable columns={columns} data={data}></DataTable>
      </div>
      <MainNewAccountView
        isOpened={isNewAccountsOpened}
        setIsOpened={setIsNewAccountsOpened}
        onCreated={loadAccounts}
      />
    </div>
  );
}
