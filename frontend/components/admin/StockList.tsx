"use client"

import { useStockData } from "@/lib/hooks/useStockData";
import { Stock } from "@/lib/types";
import {useCallback, useState} from "react";
import {STOCK_API_BASE_URL, STOCK_ERROR_MESSAGES} from "@/lib/contstants";
import { toast } from "sonner";
import { protectedPutFetch } from "@/lib/utils";
import showToastErrors from "@/components/ToastErrors";
import {Button} from "@/components/ui/button";
import {Edit} from "lucide-react";
import AdminProductListSkeleton from "@/components/Skeletons/AdminProductListSkeleton";
import TableComponent from "@/components/Table";
import CustomDialog from "@/components/admin/CustomDialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function AdminStockList() {
  const { stockItems, isLoading, setStockItems } = useStockData();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [stockToEdit, setStockToEdit] = useState<Stock | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editLocation, setEditLocation] = useState("");

  const openEditModal = useCallback((stock: Stock) => {
    setStockToEdit(stock);
    setEditQuantity(stock.quantity.toString());
    setEditLocation(stock.location ?? "");
    setEditDialogOpen(true);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    if (!editQuantity.trim() || isNaN(Number(editQuantity)) || Number(editQuantity) < 0) {
      toast.error(STOCK_ERROR_MESSAGES.quantityInvalid);
      return;
    }
    if (!editLocation.trim()) {
      toast.error(STOCK_ERROR_MESSAGES.locationRequired);
      return;
    }

    if (!stockToEdit) return;

    try {
      const response = await protectedPutFetch(`${STOCK_API_BASE_URL}${stockToEdit.id}/`, {
        quantity: Number(editQuantity),
        location: editLocation,
      });
      if (!response.ok) {
        const errorObject = await response.json();
        showToastErrors(errorObject);
        return;
      }

      toast.success("Stock updated successfully");
      setStockItems((prev) =>
        prev.map((stock) =>
          stock.id === stockToEdit.id
            ? { ...stock, quantity: Number(editQuantity), location: editLocation }
            : stock
        )
      );
      setEditDialogOpen(false);
      setStockToEdit(null);
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error(STOCK_ERROR_MESSAGES.update);
    }
  }, [editQuantity, editLocation, stockToEdit, setStockItems]);

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
              onChange={(e) => setEditQuantity(e.target.value)}
              placeholder="Enter stock quantity"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editLocation">Location</Label>
            <Input
              id="editLocation"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="Enter stock location"
            />
          </div>
        </div>
      </CustomDialog>
    </>
  );
}