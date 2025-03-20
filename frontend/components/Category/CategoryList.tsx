"use client"

import {useCategories} from "@/utilities/hooks/useCategoriesData";
import {Category} from "@/utilities/types";
import {useCallback, useState} from "react";
import {protectedDeleteFetch, protectedPostFetch, protectedPutFetch} from "@/utilities/fetchUtils";
import {CATEGORIES_API_BASE_URL, CATEGORIES_ERROR_MESSAGES} from "@/utilities/contstants";
import showToastErrors from "@/components/ToastErrors";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Edit, Trash} from "lucide-react";
import TableDataSkeleton from "@/components/Skeletons/TableDataSkeleton";
import TableComponent from "@/components/Table";
import CustomDialog from "@/components/CustomDialog";
import {CategoryForm} from "@/components/Category/CategoryForm";

interface AdminCategoryListProps {
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
}

export default function AdminCategoryList(
    {
        createDialogOpen,
        setCreateDialogOpen,
    }: AdminCategoryListProps
) {
    const {categories, isLoading, setCategories} = useCategories();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
    const [createName, setCreateName] = useState("");
    const [editName, setEditName] = useState("");

    const confirmDelete = useCallback((id: number) => {
        setCategoryToDelete(id);
        setDeleteDialogOpen(true);
    }, []);


    const handleDelete = useCallback(async () => {
        if (!categoryToDelete) return;
        try {
            const response = await protectedDeleteFetch(`${CATEGORIES_API_BASE_URL}${categoryToDelete}/`);
            if (!response.ok) {
                const errorObject = await response.json();
                showToastErrors(errorObject);
                return;
            }
            toast.success("Category deleted successfully");
            setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete));
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error(CATEGORIES_ERROR_MESSAGES.delete);
        } finally {
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    }, [categoryToDelete, setCategories]);

    const openEditModal = useCallback((category: Category) => {
        setCategoryToEdit(category);
        setEditDialogOpen(true);
        setEditName(category.name);
    }, []);

    const handleEditSubmit = useCallback(async () => {
        if (!editName.trim()) {
            toast.error(CATEGORIES_ERROR_MESSAGES.nameRequired);
            return;
        }
        if (!categoryToEdit) return;
        try {
            const response = await protectedPutFetch(`${CATEGORIES_API_BASE_URL}${categoryToEdit.id}/`, {name: editName});
            if (!response.ok) {
                const errorObject = await response.json();
                showToastErrors(errorObject);
                return;
            }
            toast.success("Category updated successfully");
            setCategories((prev) =>
                prev.map((cat) => (cat.id === categoryToEdit.id ? {...cat, name: editName} : cat))
            );
            setEditDialogOpen(false);
            setCategoryToEdit(null);
        } catch (error) {
            console.error("Error updating category:" + error);
            toast.error(CATEGORIES_ERROR_MESSAGES.update);
        }
    }, [categoryToEdit, editName, setCategories]);

    const handleCreateSubmit = useCallback(async () => {
        if (!createName.trim()) {
            toast.error(CATEGORIES_ERROR_MESSAGES.nameRequired);
            return;
        }
        try {
            const response = await protectedPostFetch(CATEGORIES_API_BASE_URL, {name: createName});
            if (!response.ok) {
                const errorObject = await response.json();
                toast.error(errorObject.message || CATEGORIES_ERROR_MESSAGES.create);
                return;
            }
            const newCategory = await response.json();
            toast.success("Category created successfully");
            setCategories((prev) => [...prev, newCategory]);
            setCreateDialogOpen(false);
            setCreateName(""); // Reset the input after success
        } catch (error) {
            console.error("Error creating category:", error);
            toast.error("An error occurred while creating the category");
        }
    }, [createName, setCreateDialogOpen, setCategories]);

    const tableHeadings = [
        {key: "name", label: "Category Name"},
        {
            key: "actions",
            label: "Actions",
            render: (_: any, item: Category) => (
                <div className="text-right flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
                        <Edit className="h-4 w-4"/>
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => confirmDelete(item.id)}>
                        <Trash className="h-4 w-4"/>
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) return <TableDataSkeleton/>;

    return (
        <>
            <TableComponent headings={tableHeadings} data={categories}/>
            <CustomDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Confirm Deletion"
                description="Are you sure you want to delete this category? This action cannot be undone."
                onConfirm={handleDelete}
                confirmText="Delete"
                confirmVariant="destructive"
            />
            <CustomDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                title="Edit Category"
                description="Update the category name below."
                onConfirm={() => handleEditSubmit()}
            >
                <CategoryForm name={editName} onNameChange={setEditName}/>
            </CustomDialog>
            <CustomDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                title="Create Category"
                description="Enter the new category name below."
                onConfirm={() => handleCreateSubmit()}
            >
                <CategoryForm name={createName} onNameChange={setCreateName}/>
            </CustomDialog>
        </>
    );
}