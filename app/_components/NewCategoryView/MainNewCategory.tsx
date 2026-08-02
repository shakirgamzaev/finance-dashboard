"use client";
import { faSquareCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { showToast } from "@/app/dashboard/ValtioStores/toastStore";
import type { Category } from "@/app/models/category";
import {
  createCategory,
  deleteCategory as deleteCategoryRequest,
  updateCategory,
} from "@/utils/AuthMethods/categoryMethods";
import CrossMark from "../CrossMark";
import CustomButton from "../CustomButtons/CustomButton";
import InputField from "../InputField";

export default function MainNewCategoryView({
  isOpened,
  setIsOpened,
  onCreated,
  onDeleted,
  category,
}: {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  onCreated?: () => void;
  onDeleted?: () => void;
  category?: Category | null;
}) {
  const isEditing = category != null;
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  //prefill on open (edit mode) and keep the current text during the close animation
  useEffect(() => {
    if (isOpened) {
      setName(category?.name ?? "");
    }
  }, [isOpened, category]);

  //creates a new category, or renames the existing one when in edit mode
  async function saveCategory() {
    setIsProcessing(true);
    try {
      if (isEditing) {
        await updateCategory(category.id, name);
      } else {
        await createCategory(name);
      }
      setIsOpened(false);
      onCreated?.();
      showToast(
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSquareCheck} className="size-4" />
          <span>{isEditing ? "Category updated!" : "Category created!"}</span>
        </div>,
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function deleteCategory() {
    if (!isEditing) return;
    setIsProcessing(true);
    try {
      await deleteCategoryRequest(category.id);
      setIsOpened(false);
      onDeleted?.();
      showToast(
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSquareCheck} className="size-4" />
          <span>Category deleted!</span>
        </div>,
      );
    } finally {
      setIsProcessing(false);
    }
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
            {isEditing ? "Edit Category" : "New Category"}
          </h2>
          <CrossMark size={15} onClick={() => setIsOpened(false)} />
        </div>
        <p className="text-[0.8rem] text-gray-500 justify-self-start">
          {isEditing
            ? "Edit the name of your category"
            : "Create a new category to organize your transactions"}
        </p>

        <InputField
          gap={3}
          label={"Name"}
          type="text"
          value={name}
          onChange={setName}
          placeholderText="e.g Food,Rent"
          extraCSS="mt-2"
        />

        <CustomButton
          handler={saveCategory}
          backgroundColor="bg-addAccount"
          label={isEditing ? "Save Changes" : "Create Category"}
          disabled={isProcessing}
        ></CustomButton>

        {isEditing && (
          <CustomButton
            handler={deleteCategory}
            backgroundColor="bg-red-600"
            disabled={isProcessing}
            label={
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faTrash} className="size-3.5" />
                <span>Delete Category</span>
              </div>
            }
          ></CustomButton>
        )}
      </div>
    </>
  );
}
