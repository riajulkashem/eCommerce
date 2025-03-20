"use client";

import React from "react";
import {useParams} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {ArrowLeft} from "lucide-react";
import {useProductData} from "@/utilities/hooks/useProductData";
import {ProductFormSkeleton} from "@/components/Skeletons/ProductFormSkeleton";
import ProductForm from "@/components/Product/ProductForm";


const EditProductPage: React.FC = () => {
    const params = useParams();
    const productId = params.id as string;
    const {categories, product: initialData = {}, isLoading} = useProductData(productId);

    return (
        <div className="container max-w-4xl p-4 py-6 md:p-8 mx-auto">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-2">
                    <Link href="/admin">
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard
                    </Link>
                </Button>
                {isLoading ? (
                    <ProductFormSkeleton/>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                        <p className="text-muted-foreground">Update product details.</p>
                    </>
                )}
            </div>
            <Card>
                {isLoading ? (
                    <ProductFormSkeleton/>
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