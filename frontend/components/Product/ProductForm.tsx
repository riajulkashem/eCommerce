import {ProductFormProps} from "@/utilities/types";
import {PRODUCT_API_BASE_URL} from "@/utilities/contstants";
import {protectedPostFetch, protectedPutFetch } from "@/utilities/fetchUtils";
import { useRouter } from "next/navigation";
import { useProductForm } from "@/utilities/hooks/useProductForm";
import {useCallback, useState} from "react";
import {validateProductFormData} from "@/utilities/formValidationUtilities";
import {toast} from "sonner";
import {CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  isEditMode,
  productId,
}) => {
  const router = useRouter();
  const { formData, errors, isLoading, setErrors, setIsLoading, updateField } =
    useProductForm(initialData);
  const [existingImageUrl] = useState<string | undefined>(initialData?.image);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validateProductFormData(formData);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;

      setIsLoading(true);
      try {
        const url = isEditMode ? `${PRODUCT_API_BASE_URL}${productId}/` : PRODUCT_API_BASE_URL;
        const method = isEditMode ? protectedPutFetch : protectedPostFetch;

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", String(Number(formData.price)));
        formDataToSend.append("category", String(Number(formData.category)));
        if (formData.image) formDataToSend.append("image", formData.image);

        const response = await method(url, formDataToSend);

        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData);
          throw new Error(errorData.message || errorData.detail|| response.statusText);
        }

        toast.success(`Product ${isEditMode ? "updated" : "created"}`, {
          description: `The product has been successfully ${isEditMode ? "updated" : "created"}.`,
        });
        router.push("/admin");
      } catch (error:any) {
        console.error(`Error ${isEditMode ? "updating" : "creating"} product:`, error?.message || error);
        toast.error(`Failed to ${isEditMode ? "update" : "create"} product`, {description: error?.message || error});
      } finally {
        setIsLoading(false);
      }
    },
    [formData, isEditMode, productId, router, setErrors, setIsLoading]
  );

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className="mb-10">
        <CardTitle>Product Information</CardTitle>
        <CardDescription>
          Enter the details of your {isEditMode ? "existing" : "new"} product.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              disabled={isLoading}
              required
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
              onChange={(e) => updateField("price", e.target.value)}
              disabled={isLoading}
              required
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
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            disabled={isLoading}
            required
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => updateField("category", value)}
              disabled={isLoading || !categories.length}
              required
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
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
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
              accept="image/*"
              onChange={(e) => updateField("image", e.target.files?.[0] || null)}
              disabled={isLoading}
              required={false}
            />
            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-5">
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