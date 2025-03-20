import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { getToken } from "@/utilities/cookie-utils";
import { Product, Category, Stock } from "@/utilities/types";
import {
  CATEGORIES_API_BASE_URL,
  CATEGORIES_ERROR_MESSAGES, PRODUCT_API_BASE_URL,
  STOCK_API_BASE_URL,
  STOCK_ERROR_MESSAGES,
} from "@/utilities/contstants";

// Common headers for JSON-based requests
const JSON_HEADERS = { "Content-Type": "application/json" };

/**
 * Fetches all categories from the API.
 * @returns Promise resolving to an array of Category objects.
 * @throws Error if the fetch request fails.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(CATEGORIES_API_BASE_URL, {
    method: "GET",
    headers: JSON_HEADERS,
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error(CATEGORIES_ERROR_MESSAGES.fetch);
  return response.json();
};

/**
 * Fetches all stock items from the API.
 * @returns Promise resolving to an array of Stock objects.
 * @throws Error if the fetch request fails.
 */
export const fetchStock = async (): Promise<Stock[]> => {
  const response = await fetch(STOCK_API_BASE_URL, {
    method: "GET",
    headers: JSON_HEADERS,
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error(STOCK_ERROR_MESSAGES.fetch);
  return response.json();
};

/**
 * Fetches all products from the API.
 * @returns Promise resolving to an array of Product objects.
 * @throws Error if the fetch request fails, with a toast notification.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(PRODUCT_API_BASE_URL, {
    cache: "no-cache",
  });
  if (!response.ok) {
    toast.error(`Failed to fetch products: ${response.statusText}`);
    throw new Error(response.statusText);
  }
  return response.json();
};

/**
 * Combines class names using clsx and merges Tailwind classes with twMerge.
 * @param inputs - Array of class values (strings, objects, etc.).
 * @returns A single merged class name string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Performs a protected POST request with authentication.
 * @param url - The API endpoint URL.
 * @param body - The request body, either as FormData or a plain object.
 * @returns Promise resolving to the fetch Response object.
 */
export const protectedPostFetch = async (url: string, body: FormData | object): Promise<Response> => {
  const token = getToken("access");
  const headers = body instanceof FormData 
    ? { Authorization: `Bearer ${token}` }
    : { ...JSON_HEADERS, Authorization: `Bearer ${token}` };

  return fetch(url, {
    method: "POST",
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
    credentials: "same-origin",
  });
};

/**
 * Performs a protected DELETE request with authentication.
 * @param url - The API endpoint URL to delete from.
 * @returns Promise resolving to the fetch Response object.
 */
export const protectedDeleteFetch = async (url: string): Promise<Response> => {
  const token = getToken("access");
  return fetch(url, {
    method: "DELETE",
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${token}`,
    },
    credentials: "same-origin",
  });
};

/**
 * Performs a protected PUT request with authentication.
 * @param url - The API endpoint URL.
 * @param body - The request body, either as FormData or a plain object.
 * @returns Promise resolving to the fetch Response object.
 */
export const protectedPutFetch = async (url: string, body: FormData | object): Promise<Response> => {
  const token = getToken("access");
  const headers = body instanceof FormData 
    ? { Authorization: `Bearer ${token}` }
    : { ...JSON_HEADERS, Authorization: `Bearer ${token}` };

  return fetch(url, {
    method: "PUT",
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
    credentials: "same-origin",
  });
};