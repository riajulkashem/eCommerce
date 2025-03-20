import React from "react";
import {CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Label} from "@/components/ui/label";

export  const ProductFormSkeleton: React.FC = () => (
  <>
    <CardHeader>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3 mt-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Product Name</Label><Skeleton className="h-10 w-full" /></div>
        <div className="space-y-2"><Label>Price ($)</Label><Skeleton className="h-10 w-full" /></div>
      </div>
      <div className="space-y-2"><Label>Description</Label><Skeleton className="h-20 w-full" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>Category</Label><Skeleton className="h-10 w-full" /></div>
        <div className="space-y-2"><Label>Image</Label><Skeleton className="h-10 w-full" /></div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-32" />
    </CardFooter>
  </>
);