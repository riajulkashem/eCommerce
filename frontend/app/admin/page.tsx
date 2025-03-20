"use client"
import {Suspense, useState} from "react"
import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Plus} from "lucide-react"
import AdminProductList from "@/components/admin/AdminProductList";
import TableDataSkeleton from "@/components/Skeletons/TableDataSkeleton";
import {useRouter} from "next/navigation";
import AdminCategoryList from "@/components/Category/CategoryList";
import AdminStockList from "@/components/StockList";

export default function AdminDashboard() {
    const [itemName, setItemName] = useState<string>('Products')
    const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
    const router = useRouter();

    const handleClick = (name: string) => {
        setItemName(name)
    }
    const handleLinkClick = () => {
        setCreateCategoryOpen(itemName === "Categories" || itemName === "Stocks")
        if (itemName === "Products") router.push("/admin/product/new")
    }
    return (
        <div className="container space-y-6 p-4 py-6 md:p-8 mx-auto">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your products, categories, and Stock.</p>
                </div>
                <Button asChild onClick={() => handleLinkClick()} className={`cursor-pointer ${itemName === "Stocks" ? "hidden" : ""}`}>
                    <span>
                        <Plus className="mr-2 h-4 w-4"/>
                        Add {itemName}
                    </span>
                </Button>
            </div>

            <Tabs defaultValue="products">
                <TabsList className="grid w-full grid-cols-3 md:w-auto">
                    <TabsTrigger onClick={() => handleClick("Products")}
                                 value="products">Products</TabsTrigger>
                    <TabsTrigger onClick={() => handleClick("Categories")}
                                 value="categories">Categories</TabsTrigger>
                    <TabsTrigger onClick={() => handleClick("Stocks")}
                                 value="stock">Stock</TabsTrigger>
                </TabsList>
                <TabsContent value="products" className="mt-4">
                    <Suspense fallback={<TableDataSkeleton/>}>
                        <AdminProductList/>
                    </Suspense>
                </TabsContent>
                <TabsContent value="categories" className="mt-4">
                    <Suspense fallback={<TableDataSkeleton/>}>
                        <AdminCategoryList
                            createDialogOpen={createCategoryOpen}
                            setCreateDialogOpen={setCreateCategoryOpen}
                        />
                    </Suspense>
                </TabsContent>
                <TabsContent value="stock" className="mt-4">
                    <Suspense fallback={<TableDataSkeleton/>}>
                        <AdminStockList/>
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
}


