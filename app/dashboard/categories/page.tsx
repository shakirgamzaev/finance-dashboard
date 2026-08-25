"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/app/_components/DataTable/MainDataTable";
import MainNewCategoryView from "@/app/_components/NewCategoryView/MainNewCategory";
import ShimmerCard from "@/app/_components/ShimmerCard";
import type { Category } from "@/app/models/category";
import {
  deleteCategories,
  deleteCategory,
  getCategories,
} from "@/utils/AuthMethods/categoryMethods";
import { getColumns } from "./columns";
import Header from "./Header";

export default function MainCategoriesPage() {
  const [isNewCategoriesOpened, setIsNewCategoriesOpened] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  //category being edited via the row actions menu; null means "create new" mode
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  //true only until the very first fetch finishes; background refetches don't touch it
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const columns = useMemo(
    () =>
      getColumns(
        (category) => {
          setEditingCategory(category);
          setIsNewCategoriesOpened(true);
        },
        async (category) => {
          setIsDeleting(true);
          try {
            await deleteCategory(category.id);
            await loadCategories();
          } catch (error) {
            console.error(error);
          } finally {
            setIsDeleting(false);
          }
        },
      ),
    [loadCategories],
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
      <div className="flex flex-col w-full max-w-212.5 justify-center -mt-7 gap-6 p-6 rounded-[13px] shadow-[3px_3px_8px_rgba(0,0,0,0.12)] bg-white">
        <Header
          setNewCategoriesOpened={(value) => {
            setEditingCategory(null);
            setIsNewCategoriesOpened(value);
          }}
        ></Header>
        <DataTable
          columns={columns}
          data={categories}
          filterColumn="name"
          filterPlaceholder="names..."
          disabled={isDeleting}
          onDelete={async (rows) => {
            setIsDeleting(true);
            try {
              const ids = rows.map((row) => row.original.id);
              await deleteCategories(ids);
              await loadCategories();
            } catch (error) {
              console.error(error);
            } finally {
              setIsDeleting(false);
            }
          }}
        ></DataTable>
      </div>
      <MainNewCategoryView
        isOpened={isNewCategoriesOpened}
        setIsOpened={setIsNewCategoriesOpened}
        onCreated={loadCategories}
        onDeleted={loadCategories}
        category={editingCategory}
      />
    </div>
  );
}
