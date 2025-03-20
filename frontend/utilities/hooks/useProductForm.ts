import {ProductFormData} from "@/utilities/types";
import {useCallback, useState} from "react";

export const useProductForm = (initialData?: Partial<ProductFormData> & { image?: string }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    image: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = useCallback(
    (field: keyof ProductFormData, value: string | File | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [errors]
  );

  return { formData, errors, isLoading, setErrors, setIsLoading, updateField };
};