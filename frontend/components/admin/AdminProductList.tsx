"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchProducts, protectedDeleteFetch } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import TableComponent from "@/components/Table";
import showToastErrors from "@/components/ToastErrors";
import AdminProductListSkeleton from "@/components/Skeletons/AdminProductListSkeleton";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  category_name: string;
  image: string;
  stock: number;
}

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data as Product[] | []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const confirmDelete = (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        const response = await protectedDeleteFetch(
          `http://127.0.0.1:8000/api/v1/products/product/${productToDelete}/`
        );
        if (!response.ok) {
          const errorObject = await response.json();
          showToastErrors(errorObject);
        }

        toast.success("Product deleted successfully");
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productToDelete));
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(`Failed to delete product: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const tableHeadings = [
    {
      key: "product",
      label: "Product",
      render: (_: any, item: Product) => (
        <div className="flex items-center gap-3">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    { key: "category_name", label: "Category" },
    { key: "price", label: "Price", render: (value: string) => `$${value}` },
    { key: "stock", label: "Stock", render: (value: number) => `$${value}` }, // Hardcoded as 0 per your example
    { key: "actions", label: "Actions" },
  ];

  if (isLoading) return <AdminProductListSkeleton />

  return (
    <>
      <TableComponent
        headings={tableHeadings}
        data={products}
        onDelete={confirmDelete}
        getEditUrl={(id) => `/admin/product/${id}/edit`}
      />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}