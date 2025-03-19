"use client"

import {useState, useEffect} from "react"
import Image from "next/image"
import Link from "next/link"
import {useSearchParams} from "next/navigation"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"
import {Heart, ShoppingCart, Star} from "lucide-react"
import ProductListSkeleton from "@/components/Skeletons/ProductListSkeleton";

interface  Product {
    id: number
    name: string
    price: number
    description: string
    image: string
    category_name: string
}


export default function ProductList() {
    const [products, setProducts] = useState<Product[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/v1/product/');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data:Product[] = await response.json();
                setProducts(data);
            } catch (err:any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products?.length ? products.map((product, index) => (
                <Card key={index + 1}
                    className="py-0 group overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg dark:border-border/20 dark:hover:border-primary/10"
                >
                    <CardHeader  className="p-0">
                        <div className="relative aspect-square overflow-hidden">
                            <Link href={`/products/${product.id}`}>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="px-4">
                        <Link href={`/products/${product.id}`}>
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium">{product.name}</h3>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                                </div>
                                <Badge variant="outline" className="ml-2 capitalize">
                                    {product.category_name}
                                </Badge>
                            </div>
                            <p className="mt-3 text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                        </Link>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/30 p-4 dark:bg-muted/10">
                        <div className="flex w-full gap-2">
                            <Button
                                className="flex-1 bg-gradient-to-r from-primary to-primary/90 transition-all hover:from-primary/90 hover:to-primary">
                                <ShoppingCart className="mr-2 h-4 w-4"/>
                                Add to Cart
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                                <Link href={`/products/${product.id}`}>
                                    <span className="sr-only">View details</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </Link>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )): ProductListSkeleton()}
        </div>
    )
}

