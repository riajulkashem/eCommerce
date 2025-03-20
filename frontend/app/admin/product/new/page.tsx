"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ProductForm from "@/components/admin/ProductForm";
import {ProductFormSkeleton} from "@/components/Skeletons/ProductFormSkeleton";
import {Category} from "@/lib/types";


const CreateProductPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/products/category/", {
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
        });
        if (!response.ok) toast.error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
            <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product for your store.</p>
          </>
        )}
      </div>
      <Card>
        {isLoading ? <ProductFormSkeleton /> : <ProductForm categories={categories} isEditMode={false} />}
      </Card>
    </div>
  );
};

export default CreateProductPage;