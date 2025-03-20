"use client"
import NavBar from "@/components/NavBar";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {Suspense} from "react";
import {ProfileTabs} from "@/components/profile/ProfileTabs";
import {ProductFormSkeleton} from "@/components/Skeletons/ProductFormSkeleton";

export default function ProfilePage() {
  return (
    <>
      <NavBar />
      <div className="container max-w-4xl p-4 py-6 md:p-8 mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        <Suspense fallback={<ProductFormSkeleton />}>
          <ProfileTabs />
        </Suspense>
      </div>
    </>
  );
}