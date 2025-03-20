import {useEffect, useState} from "react";
import {Product} from "@/utilities/types";
import {fetchProducts} from "@/utilities/fetchUtils";
import {PRODUCT_ERROR_MESSAGES} from "@/utilities/contstants";
import {toast} from "sonner";

export const useAdminProductData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts((data as Product[]) || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(PRODUCT_ERROR_MESSAGES.fetch);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, isLoading, setProducts };
};