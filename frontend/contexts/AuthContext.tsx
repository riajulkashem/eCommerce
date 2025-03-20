'use client';

import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getUser, login, logout, register, verifyToken} from '@/lib/auth';
import {CommonErrorResponse, CommonSuccessResponse, LoginSuccessResponse, User} from "@/lib/types";
import {storeToken} from "@/lib/cookie-utils";
import {usePathname, useRouter} from "next/navigation";
import {toast} from "sonner";


interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginUser: (email: string, password: string) => Promise<LoginSuccessResponse | CommonErrorResponse>;
    registerUser: (
        first_name: string,
        last_name: string,
        email: string,
        password: string,
    ) => Promise<CommonSuccessResponse | any>;
    logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const pathname = usePathname(); // Get current path
    const router = useRouter();
    const protectedPaths = ['/user', '/profile', '/admin'];

    useEffect(() => {
        console.log("AuthProvider is called");
        async function checkAuth() {
            console.log("AuthProvider is cehckAuth is called");
            const isValid = await verifyToken();
            console.log("AuthProvider is valid", isValid);
            if (isValid) {
                console.log("Verifying token successfully");
                setUser(await getUser());
            } else if (protectedPaths.some((path) => pathname.startsWith(path))) {
                toast.warning('Log In To Access This Page')
                // Redirect to login with current path if unauthorized
                router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
            }
            setLoading(false);
        }

        checkAuth();
    }, [pathname, router]);

    const loginUser = async (email: string, password: string) => {
        const data = await login(email, password) as LoginSuccessResponse | CommonErrorResponse
        if ('user' in data && 'access' in data && 'refresh' in data) {
            setUser(data.user);
            storeToken(data.access, 'access')
            storeToken(data.refresh, 'refresh')
            toast.success('Logged in successfully!');
            // After login, redirect to the original path or default to dashboard
            const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/admin';
            router.push(redirectPath);
        } else toast.error('Error', {
            description: data.detail || 'Login Failed',
        })
        return data;
    };

    const registerUser = async (
        first_name: string,
        last_name: string,
        email: string,
        password: string
    ) => {
        const response: any = await register(first_name, last_name, email, password)
        if (response.ok) {
            toast.success('You have successfully registered your account!');
            router.push('/auth/login');
        }
    };

    const logoutUser = async () => {
        await logout();
        setUser(null);
    };

    const value = {user, loading, loginUser, registerUser, logoutUser}
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};