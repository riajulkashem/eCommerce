"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { protectedPutFetch } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import TableComponent from "@/components/Table";
import CustomDialog from "@/components/admin/CustomDialog";
import AdminProductListSkeleton from "@/components/Skeletons/AdminProductListSkeleton";

interface Stock {
  id: number;
  quantity: number;
  location: string;
  product: number; // Product ID
  product_name?: string; // Optional, if serializer includes product details
}

const fetchStock = async (): Promise<Stock[]> => {
  const response = await fetch("http://127.0.0.1:8000/api/v1/products/stock/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error("Failed to fetch stock");
  return response.json();
};

export default function AdminStockList() {
  const [stockItems, setStockItems] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [stockToEdit, setStockToEdit] = useState<Stock | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const loadStock = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStock();
        setStockItems(data);
      } catch (error) {
        console.error("Error fetching stock:", error);
        toast.error("Failed to load stock");
      } finally {
        setIsLoading(false);
      }
    };

    loadStock();
  }, []);

  const openEditModal = (stock: Stock) => {
    setStockToEdit(stock);
    setEditQuantity(stock.quantity.toString()); // quantity is a number, so this is fine
    setEditLocation(stock.location ?? ""); // Default to empty string if null/undefined
    setEditError(null);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editQuantity.trim() || isNaN(Number(editQuantity)) || Number(editQuantity) < 0) {
      setEditError("Please enter a valid non-negative quantity");
      return;
    }
    if (!editLocation.trim()) {
      setEditError("Location is required");
      return;
    }

    if (stockToEdit) {
      try {
        const response = await protectedPutFetch(
          `http://127.0.0.1:8000/api/v1/products/stock/${stockToEdit.id}/`,
          {
            quantity: Number(editQuantity),
            location: editLocation
          }
        );
        if (!response.ok) {
          const errorObject = await response.json();
          toast.error(errorObject.message || "Failed to update stock");
          return;
        }

        toast.success("Stock updated successfully");
        setStockItems((prevStock) =>
          prevStock.map((stock) =>
            stock.id === stockToEdit.id
              ? { ...stock, quantity: Number(editQuantity), location: editLocation }
              : stock
          )
        );
        setEditDialogOpen(false);
        setStockToEdit(null);
      } catch (error) {
        console.error("Error updating stock:", error);
        toast.error(`Failed to update stock: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
  };
  const tableHeadings = [
    {
      key: "product",
      label: "Product",
      render: (_: any, item: Stock) => (
        <span>{item.product}</span>
      ),
    },
    { key: "quantity", label: "Quantity" },
    { key: "location", label: "Location" },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, item: Stock) => (
        <div className="text-right">
          <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <AdminProductListSkeleton />;

 return (
    <>
      <TableComponent headings={tableHeadings} data={stockItems} />
      <CustomDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Update Stock"
        description="Update the stock details below."
        onConfirm={handleEditSubmit}
        confirmText="Save"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editQuantity">Quantity</Label>
            <Input
              id="editQuantity"
              type="number"
              value={editQuantity}
              onChange={(e) => {
                setEditQuantity(e.target.value);
                if (editError) setEditError(null);
              }}
              placeholder="Enter stock quantity"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editLocation">Location</Label>
            <Input
              id="editLocation"
              value={editLocation}
              onChange={(e) => {
                setEditLocation(e.target.value);
                if (editError) setEditError(null);
              }}
              placeholder="Enter stock location"
            />
          </div>
          {editError && <p className="text-sm text-destructive">{editError}</p>}
        </div>
      </CustomDialog>
    </>
  );
}