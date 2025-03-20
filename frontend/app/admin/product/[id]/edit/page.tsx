"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {Category, ProductFormData} from "@/lib/types";
import ProductForm from "@/components/admin/ProductForm";

const ProductFormSkeleton: React.FC = () => (
  <>
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-2/3 mt-2" />
  </>
);

const EditProductPage: React.FC = () => {
  const params = useParams();
  const productId = params.id as string;
  const [initialData, setInitialData] = useState<ProductFormData | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/products/category/", {
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
        });
        if (!response.ok) toast.error(response.statusText);
        return await response.json();
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
        return [];
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/products/product/${productId}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
        });
        if (!response.ok) toast.error(response.statusText);
        const data = await response.json();
        console.log(data);
        return {
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category ? String(data.category) : "",
          image: data.image || "",
        };
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
        return undefined;
      }
    };

    Promise.all([fetchCategories(), fetchProduct()]).then(([catData, prodData]) => {
      setCategories(catData);
      setInitialData(prodData);
      setIsLoading(false);
      console.log("prodData ", prodData);
      console.log("catData ", catData);
    });
  }, [productId]);

  // @ts-ignore
  return (
    <div className="container max-w-4xl p-4 py-6 md:p-8 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        {isLoading ? (
          <ProductFormSkeleton />
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">Update product details.</p>
          </>
        )}
      </div>
      <Card>
        {isLoading ? (
          <ProductFormSkeleton />
        ) : (
          <ProductForm
            initialData={initialData}
            categories={categories}
            isEditMode={true}
            productId={productId}
          />
        )}
      </Card>
    </div>
  );
};

export default EditProductPage;