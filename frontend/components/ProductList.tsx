"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, ShoppingCart, Star } from "lucide-react"

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 199.99,
    category: "electronics",
    image: "https://placehold.co/300x300",
    rating: 4.5,
    featured: true,
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Track your fitness and stay connected",
    price: 249.99,
    category: "electronics",
    image: "https://placehold.co/300x300",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    description: "Comfortable and stylish everyday wear",
    price: 24.99,
    category: "clothing",
    image: "https://placehold.co/300x300",
    rating: 4.0,
    featured: true,
  },
  {
    id: 4,
    name: "Denim Jeans",
    description: "Classic fit denim jeans",
    price: 59.99,
    category: "clothing",
    image: "https://placehold.co/300x300",
    rating: 4.3,
  },
  {
    id: 5,
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 89.99,
    category: "home",
    image: "https://placehold.co/300x300",
    rating: 4.7,
    featured: true,
  },
  {
    id: 6,
    name: "Non-Stick Cookware Set",
    description: "10-piece non-stick cookware set",
    price: 129.99,
    category: "home",
    image: "https://placehold.co/300x300",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Bestselling Novel",
    description: "The latest bestselling fiction novel",
    price: 14.99,
    category: "books",
    image: "https://placehold.co/300x300",
    rating: 4.8,
  },
  {
    id: 8,
    name: "Cookbook",
    description: "Collection of gourmet recipes",
    price: 29.99,
    category: "books",
    image: "https://placehold.co/300x300",
    rating: 4.6,
  },
]

export default function ProductList() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState(mockProducts)
  const [wishlist, setWishlist] = useState<number[]>([])

  // Extract the specific search params values we need
  const categoryParam = searchParams.get("category")
  const queryParam = searchParams.get("query")?.toLowerCase()

  // Use useEffect with specific dependencies instead of the entire searchParams object
  useEffect(() => {
    let filteredProducts = [...mockProducts]

    if (categoryParam && categoryParam !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.category === categoryParam)
    }

    if (queryParam) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(queryParam) || product.description.toLowerCase().includes(queryParam),
      )
    }

    setProducts(filteredProducts)
  }, [categoryParam, queryParam]) // Only depend on the specific values we extracted

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  // Function to render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : i < rating
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="py-0 group overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg dark:border-border/20 dark:hover:border-primary/10"
        >
          <CardHeader className="p-0">
            <div className="relative aspect-square overflow-hidden">
              <div className="absolute right-2 top-2 z-10">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground dark:bg-gray-800/80"
                >
                  <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.featured && (
                  <div className="absolute left-0 top-3 rounded-r-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Featured
                  </div>
                )}
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
                  {product.category}
                </Badge>
              </div>
              {product.rating && <div className="mt-2">{renderRating(product.rating)}</div>}
              <p className="mt-3 text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
            </Link>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 p-4 dark:bg-muted/10">
            <div className="flex w-full gap-2">
              <Button className="flex-1 bg-gradient-to-r from-primary to-primary/90 transition-all hover:from-primary/90 hover:to-primary">
                <ShoppingCart className="mr-2 h-4 w-4" />
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
      ))}
    </div>
  )
}

