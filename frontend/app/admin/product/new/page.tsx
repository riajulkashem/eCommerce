"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useProductData } from "@/utilities/hooks/useProductData";
import {ProductFormSkeleton} from "@/components/Skeletons/ProductFormSkeleton";
import ProductForm from "@/components/Product/ProductForm";

const CreateProductPage: React.FC = () => {
  const { categories, isLoading } = useProductData();

  return (
    <div className="container max-w-4xl p-4 py-6 md:p-8 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
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
        {isLoading ? (
          <ProductFormSkeleton />
        ) : (
          <ProductForm categories={categories} isEditMode={false} />
        )}
      </Card>
    </div>
  );
};

export default CreateProductPage;