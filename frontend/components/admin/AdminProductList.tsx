"use client"
import {Product} from "@/utilities/types";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Edit, Trash} from "lucide-react";
import {useAdminProductData} from "@/utilities/hooks/useAdminProductData";
import {useCallback, useState} from "react";
import {protectedDeleteFetch} from "@/utilities/fetchUtils";
import {PRODUCT_API_BASE_URL, PRODUCT_ERROR_MESSAGES} from "@/utilities/contstants";
import showToastErrors from "@/components/ToastErrors";
import {toast} from "sonner";
import TableDataSkeleton from "@/components/Skeletons/TableDataSkeleton";
import TableComponent from "@/components/Table";
import Image from "next/image";
import CustomDialog from "@/components/CustomDialog";

export default function AdminProductList() {
    const {products, isLoading, setProducts} = useAdminProductData();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    const confirmDelete = useCallback((id: number) => {
        setProductToDelete(id);
        setDeleteDialogOpen(true);
    }, []);

    const handleDelete = useCallback(async () => {
        if (!productToDelete) return;

        try {
            const response = await protectedDeleteFetch(`${PRODUCT_API_BASE_URL}${productToDelete}/`);
            if (!response.ok) {
                const errorObject = await response.json();
                showToastErrors(errorObject);
                return;
            }

            toast.success("Product deleted successfully");
            setProducts((prev) => prev.filter((product) => product.id !== productToDelete));
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error(
                `${PRODUCT_ERROR_MESSAGES.delete}: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        } finally {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    }, [productToDelete, setProducts]);

    const tableHeadings = [
        {
            key: "product",
            label: "Product",
            render: (_: any, item: Product) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={item.image || "https://placehold.co/30x30"}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                    />
                    <span className="font-medium">{item.name}</span>
                </div>
            ),
        },
        {key: "category_name", label: "Category"},
        {key: "price", label: "Price", render: (value: string) => `$${value}`},
        {key: "stock", label: "Stock", render: (value: number) => `${value}`},
        {
            key: "actions",
            label: "Actions",
            render: (_: any, item: Product) => (
                <div className="text-right flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/product/${item.id}/edit`}>
                            <Edit className="h-4 w-4"/>
                            <span className="sr-only">Edit</span>
                        </Link>
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
            <TableComponent headings={tableHeadings} data={products}/>
            <CustomDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Confirm Deletion"
                description="Are you sure you want to delete this product? This action cannot be undone."
                onConfirm={handleDelete}
                confirmText="Delete"
                confirmVariant="destructive"
            />
        </>
    );
}