// URLS
const BASE_API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
console.log("BASE_API_URL: ", BASE_API_URL);
export const AUTH_BASE_URL = BASE_API_URL + '/auth'
export const USER_BASE_URL = BASE_API_URL + '/user'
export const PRODUCT_API_BASE_URL = BASE_API_URL + "/products/product/";
export const CATEGORIES_API_BASE_URL = BASE_API_URL + "/products/category/";
export const STOCK_API_BASE_URL = BASE_API_URL + "/products/stock/";

// Products
export const PRODUCT_ERROR_MESSAGES = {
    name: "Product name is required",
    description: "Description is required",
    priceRequired: "Price is required",
    priceInvalid: "Price must be a positive number",
    category: "Category is required",
    image: "Image is required",
    fetch: "Failed to load products",
    delete: "Failed to delete product",
};

// Categories
export const CATEGORIES_ERROR_MESSAGES = {
    fetch: "Failed to load categories",
    delete: "Failed to delete category",
    update: "Failed to update category",
    create: "Failed to create category",
    nameRequired: "Category name is required",
};

export const STOCK_ERROR_MESSAGES = {
    fetch: "Failed to load stock",
    update: "Failed to update stock",
    quantityInvalid: "Please enter a valid non-negative quantity",
    locationRequired: "Location is required",
};