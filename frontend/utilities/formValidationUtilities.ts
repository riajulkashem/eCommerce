import {ProductFormData} from "@/utilities/types";
import {PRODUCT_ERROR_MESSAGES} from "@/utilities/contstants";

export const validateProductFormData = (
  formData: ProductFormData
): Partial<Record<keyof ProductFormData, string>> => {
  const errors: Partial<Record<keyof ProductFormData, string>> = {};
  if (!formData.name.trim()) errors.name = PRODUCT_ERROR_MESSAGES.name;
  if (!formData.description.trim()) errors.description = PRODUCT_ERROR_MESSAGES.description;
  if (!formData.price) {
    errors.price = PRODUCT_ERROR_MESSAGES.priceRequired;
  } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
    errors.price = PRODUCT_ERROR_MESSAGES.priceInvalid;
  }
  if (!formData.category) errors.category = PRODUCT_ERROR_MESSAGES.category;
  return errors;
};