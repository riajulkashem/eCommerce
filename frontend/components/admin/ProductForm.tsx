"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { protectedPostFetch, protectedPutFetch } from "@/lib/utils";
import Link from "next/link";
import {Category, ProductFormData} from "@/lib/types";

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { image?: string };  // Allow string for edit mode
  categories: Category[];
  isEditMode: boolean;
  productId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, isEditMode, productId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    image: null,  // File starts as null, not a string
  });
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>(initialData?.image);  // For edit mode
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (!formData.category) newErrors.category = "Category is required";
    if (!isEditMode && !formData.image) newErrors.image = "Image is required";  // Only required for create
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProductFormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
    if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
    if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const url = isEditMode
        ? `http://127.0.0.1:8000/api/v1/products/product/${productId}/`
        : "http://127.0.0.1:8000/api/v1/products/product/";
      const method = isEditMode ? protectedPutFetch : protectedPostFetch;

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", String(Number(formData.price)));
      formDataToSend.append("category", String(Number(formData.category)));
      if (formData.image) formDataToSend.append("image", formData.image);

      const response = await method(url, formDataToSend);

      if (response.ok) {
        toast.success(`Product ${isEditMode ? "updated" : "created"}`, {
          description: `The product has been successfully ${isEditMode ? "updated" : "created"}.`,
        });
        router.push("/admin");
      } else {
        toast.warning(response.statusText);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} product:`, error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} product`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Enter the details of your {isEditMode ? "existing" : "new"} product.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            disabled={isLoading}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleSelectChange}
              required
              disabled={isLoading || !categories.length}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            {isEditMode && existingImageUrl && (
              <p className="text-sm text-muted-foreground">Current: {existingImageUrl}</p>
            )}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"  // Restrict to image files
              onChange={handleFileChange}
              required={!isEditMode}  // Only required for create
              disabled={isLoading}
            />
            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild disabled={isLoading}>
          <Link href="/admin">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isEditMode ? "Update Product" : "Create Product"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default ProductForm;