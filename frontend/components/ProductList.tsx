"use client"

import {useState, useEffect} from "react"
import Image from "next/image"
import Link from "next/link"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"
import {ShoppingCart} from "lucide-react"

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


    useEffect(() => {
        const fetchProducts = async () => {

                const response = await fetch('http://localhost:8000/api/v1/product/');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data:Product[] = await response.json();
                return data;
        };
        fetchProducts().then(response => setProducts(response));
    }, []);

    return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products?.map((product, index) => (
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
                    <CardContent className="px-4 pb-4">
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
                </Card>
            ))}
        </div>
    )
}

