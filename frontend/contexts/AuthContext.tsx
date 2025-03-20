"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUser, login, logout, register, verifyToken } from "@/utilities/auth";
import { storeToken } from "@/utilities/cookie-utils";
import { CommonErrorResponse, CommonSuccessResponse, LoginSuccessResponse, User } from "@/utilities/types";

// Constants
const PROTECTED_PATHS = ["/user", "/profile", "/admin"] as const;
const ADMIN_PATHS = ["/admin"];
const HOME_PATH = "/";
const LOGIN_PATH = "/auth/login";

// Type Definitions
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginUser: (
    email: string,
    password: string
  ) => Promise<LoginSuccessResponse | CommonErrorResponse>;
  registerUser: (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => Promise<CommonSuccessResponse | CommonErrorResponse>;
  logoutUser: () => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Checks authentication status and updates user state on mount or path change.
   * Redirects to login if accessing a protected path without a valid token.
   */
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const isValid = await verifyToken();

      if (isValid) {
        const fetchedUser = await getUser();
        if (ADMIN_PATHS.some((path) => pathname.startsWith(path)) && !fetchedUser?.is_staff) {
          toast.warning("WARNING", {description: "You dont have access to this page!"});
          router.push(HOME_PATH);
        }
        setUser(fetchedUser);
      } else if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
        toast.warning("Log in to access this page");
        router.push(`${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`);
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  /**
   * Logs in a user and stores tokens if successful.
   * @param email - User's email address.
   * @param password - User's password.
   * @returns Promise resolving to login response data.
   */
  const loginUser = useCallback(
    async (email: string, password: string) => {
      try {
        const data = (await login(email, password)) as
          | LoginSuccessResponse
          | CommonErrorResponse;

        if ("user" in data && "access" in data && "refresh" in data) {
          setUser(data.user);
          storeToken(data.access, "access");
          storeToken(data.refresh, "refresh");
          toast.success("Logged in successfully!");

          // redirect to previous tried URL
          const redirectPath =
            new URLSearchParams(window.location.search).get("redirect") || HOME_PATH;
          router.push(redirectPath);
        } else {
          toast.error("Login Failed", { description: data.detail || "Unknown error" });
        }

        return data;
      } catch (error) {
        toast.error("Login Failed", { description: "An unexpected error occurred" });
        throw error;
      }
    },
    [router]
  );

  /**
   * Registers a new user and redirects to login on success.
   * @param first_name - User's first name.
   * @param last_name - User's last name.
   * @param email - User's email address.
   * @param password - User's password.
   * @returns Promise resolving to registration response data.
   */
  const registerUser = useCallback(
    async (first_name: string, last_name: string, email: string, password: string) => {
      try {
        const response = (await register(
          first_name,
          last_name,
          email,
          password
        )) as CommonSuccessResponse | CommonErrorResponse;

        if ("message" in response) {
          toast.success("Your account has been registered!");
          router.push(LOGIN_PATH);
        } else {
          toast.error("Registration Failed", {
            description: response.detail || "Unknown error",
          });
        }

        return response;
      } catch (error) {
        toast.error("Registration Failed", { description: "An unexpected error occurred" });
        throw error;
      }
    },
    [router]
  );

  /**
   * Logs out the current user and clears the user state.
   */
  const logoutUser = useCallback(async () => {
    await logout();
    setUser(null);
    toast.success("Logged out successfully!");
    router.push(HOME_PATH);
  }, [router]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ user, loading, loginUser, registerUser, logoutUser }),
    [user, loading, loginUser, registerUser, logoutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access the AuthContext.
 * @returns AuthContextType containing user state and auth methods.
 * @throws Error if used outside of an AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}