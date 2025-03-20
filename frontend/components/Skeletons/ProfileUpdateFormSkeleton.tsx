import React from "react";
import {CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Label} from "@/components/ui/label";

export const ProfileFormSkeleton: React.FC = () => {
  return (
    <>
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Address</Label>
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
      <CardFooter className="mt-5">
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </>
  );
};