"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
}

interface ProductData {
  categories: Category[];
  product?: ProductFormData;
  isLoading: boolean;
}

export const useProductData = (productId?: string): ProductData => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<ProductFormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/products/category/", {
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error(`Failed to fetch categories: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      return [];
    }
  };

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/products/product/${id}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error(`Failed to fetch product: ${response.statusText}`);
      const data = await response.json();
      return {
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        category: data.category ? String(data.category) : "",
        image: data.image || "",
      };
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product data");
      return undefined;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const fetches = [fetchCategories()];
      if (productId) fetches.push(fetchProduct(productId));

      try {
        const [catData, prodData] = await Promise.all(fetches);
        setCategories(catData);
        if (prodData) setProduct(prodData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId]);

  return { categories, product, isLoading };
};