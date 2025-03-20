import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import AdminProductList from "@/components/admin/AdminProductList";
import AdminProductListSkeleton from "@/components/Skeletons/AdminProductListSkeleton";

export default function AdminDashboard() {
  return (
    <div className="container space-y-6 p-4 py-6 md:p-8 mx-auto">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your products, categories, and Stock.</p>
        </div>
        <Button asChild>
          <Link href="/admin/product/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-4">
          <Suspense fallback={<AdminProductListSkeleton />}>
            <AdminProductList />
          </Suspense>
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Category management interface would be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stock" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Stock management interface would be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


