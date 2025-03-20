export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    category: string;
    image: File | null;
}

export interface Product {
    id: number
    name: string;
    description: string;
    price: string;
    category?: string;
    category_name?: string;
    image: string;
}


export interface Category {
    id: number
    name: string
}

export interface Stock {
    id: number
    product_name: string
    quantity: number
    location: string
}

export interface User {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    is_staff: boolean;
}

export interface UserProfile {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address: string
}

export interface RefreshTokenResponse {
    access: string;
    refresh: string;
}

export interface LoginSuccessResponse extends RefreshTokenResponse {
    user: User;
}

export interface CommonErrorResponse {
    detail: string;
}

export interface CommonSuccessResponse {
    detail: string;
}

export interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { image?: string };
  categories: Category[];
  isEditMode: boolean;
  productId?: string;
}

export interface Stock {
  id: number;
  quantity: number;
  location: string;
  product: number;
}