"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {protectedDeleteFetch, protectedPostFetch, protectedPutFetch} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import showToastErrors from "@/components/ToastErrors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash } from "lucide-react";
import AdminProductListSkeleton from "@/components/Skeletons/AdminProductListSkeleton";
import TableComponent from "@/components/Table";
import CustomDialog from "@/components/admin/CustomDialog";

interface Category {
  id: number;
  name: string;
}

interface AdminCategoryListProps {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch("http://127.0.0.1:8000/api/v1/products/category/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

export default function AdminCategoryList({createDialogOpen, setCreateDialogOpen}:AdminCategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [createName, setCreateName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const confirmDelete = (id: number) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        const response = await protectedDeleteFetch(
          `http://127.0.0.1:8000/api/v1/products/category/${categoryToDelete}/`
        );
        if (!response.ok) {
          const errorObject = await response.json();
          showToastErrors(errorObject);
          return;
        }

        toast.success("Category deleted successfully");
        setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== categoryToDelete));
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error(`Failed to delete category: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  const openEditModal = (category: Category) => {
    console.log("openEditModal", category);
    setCategoryToEdit(category);
    setEditName(category.name);
    setEditError(null);
    setEditDialogOpen(true);
    console.log("editDialogOpen set to:", true);
  };

  const handleEditSubmit = async () => {
    if (!editName.trim()) {
      setEditError("Category name is required");
      return;
    }

    if (categoryToEdit) {
      try {
        const response = await protectedPutFetch(
          `http://127.0.0.1:8000/api/v1/products/category/${categoryToEdit.id}/`,
          { name: editName }
        );
        if (!response.ok) {
          const errorObject = await response.json();
          showToastErrors(errorObject);
          return;
        }

        toast.success("Category updated successfully");
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === categoryToEdit.id ? { ...cat, name: editName } : cat
          )
        );
        setEditDialogOpen(false);
        setCategoryToEdit(null);
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error(`Failed to update category: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
  };

  const handleCreateSubmit = async () => {
    if (!createName.trim()) {
      setCreateError("Category name is required");
      return;
    }

    try {
      const response = await protectedPostFetch(
        "http://127.0.0.1:8000/api/v1/products/category/",
        { name: createName }
      );
      if (!response.ok) {
        const errorObject = await response.json();
        toast.error(errorObject.message || "Failed to create category");
        return;
      }

      const newCategory = await response.json();
      toast.success("Category created successfully");
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setCreateDialogOpen(false);
      setCreateName("");
      setCreateError(null);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(`Failed to create category: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const tableHeadings = [
    { key: "name", label: "Category Name" },
    {
      key: "categoryActions",
      label: "Actions",
      render: (_: any, item: Category) => (
        <div className="text-right">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => confirmDelete(item.id)}>
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <AdminProductListSkeleton />;

  return (
    <>
      <TableComponent
        headings={tableHeadings}
        data={categories}
        onDelete={confirmDelete}
        getEditUrl={() => ""}
      />
      {/* Delete Confirmation Dialog */}
      <CustomDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        confirmVariant="destructive"
      />
      {/* Edit Form Dialog */}
      <CustomDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Category"
        description="Update the category name below."
        onConfirm={handleEditSubmit}
        confirmText="Save"
      >
        <div className="space-y-2">
          <Label htmlFor="editName">Category Name</Label>
          <Input
            id="editName"
            value={editName}
            onChange={(e) => {
              setEditName(e.target.value);
              if (editError) setEditError(null);
            }}
            placeholder="Enter category name"
          />
          {editError && <p className="text-sm text-destructive">{editError}</p>}
        </div>
      </CustomDialog>
      {/* Create New Category */}
      <CustomDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Create Category"
        description="Enter the new category name below."
        onConfirm={handleCreateSubmit}
        confirmText="Create"
      >
        <div className="space-y-2">
          <Label htmlFor="createName">Category Name</Label>
          <Input
            id="createName"
            value={createName}
            onChange={(e) => {
              setCreateName(e.target.value);
              if (createError) setCreateError(null);
            }}
            placeholder="Enter new category name"
          />
          {createError && <p className="text-sm text-destructive">{createError}</p>}
        </div>
      </CustomDialog>
    </>
  );
}