import {useEffect, useState} from "react";
import {Category} from "@/utilities/types";
import {toast} from "sonner";
import {CATEGORIES_ERROR_MESSAGES} from "@/utilities/contstants";
import {fetchCategories} from "@/utilities/fetchUtils";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(CATEGORIES_ERROR_MESSAGES.fetch);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  return { categories, isLoading, setCategories };
};