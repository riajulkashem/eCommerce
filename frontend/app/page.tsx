import {SiteHeader} from "@/components/SiteHeader";
import {Suspense} from "react";
import ProductListSkeleton from "@/components/Skeletons/ProductListSkeleton";
import ProductList from "@/components/ProductList";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">

      <SiteHeader />
      {/* Hero Section */}
      <div className="relative overflow-hidden ">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
        <div className="absolute -top-12 left-1/3 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl dark:bg-pink-500/5" />
        <div className="absolute top-32 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

        <div className="container relative z-10 px-4 py-16 sm:py-24 md:py-32 mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl dark:from-primary dark:to-pink-400">
              Discover Amazing Products
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Browse our collection of high-quality products at competitive prices. Find exactly what you're looking for
              with our easy-to-use search and filters.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="#products"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Shop Now
              </a>
              <a
                href="#categories"
                className="rounded-full bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
              >
                Browse Categories
              </a>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-12 w-full fill-background md:h-16">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0z" />
          </svg>
        </div>
      </div>

      <div id="products" className="container px-4 py-8 mx-auto">
        <div className="relative">
          {/* Decorative background elements */}
          <div className="absolute -right-64 top-32 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/3" />
          <div className="absolute -left-64 top-96 h-96 w-96 rounded-full bg-pink-500/5 blur-3xl dark:bg-pink-500/3" />


          {/* Product List */}
          <div className="relative z-10">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

