import { toast } from "sonner";
import { getToken, removeTokens, storeToken } from "@/utilities/cookie-utils";
import { protectedPostFetch } from "@/utilities/fetchUtils";
import { RefreshTokenResponse, User } from "@/utilities/types";
import {AUTH_BASE_URL, USER_BASE_URL} from "@/utilities/contstants";


const HEADERS = {
  "Content-Type": "application/json",
};


/**
 * Performs a login request to the authentication API.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns Promise resolving to the API response data (e.g., tokens).
 * @throws Error if the login request fails.
 */
export async function login(email: string, password: string): Promise<any> {
  const response = await fetch(`${AUTH_BASE_URL}/login/`, {
    method: "POST",
    headers: HEADERS,
    credentials: "same-origin",
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

/**
 * Registers a new user with the authentication API.
 * @param first_name - User's first name.
 * @param last_name - User's last name.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns Promise resolving to the API response data (e.g., user details or tokens).
 * @throws Error if the registration request fails.
 */
export async function register(
  first_name: string,
  last_name: string,
  email: string,
  password: string
): Promise<any> {
  const response = await fetch(`${AUTH_BASE_URL}/register/`, {
    method: "POST",
    headers: HEADERS,
    credentials: "same-origin",
    body: JSON.stringify({ first_name, last_name, email, password }),
  });

  if (!response.ok) {
    toast.error(`Registration failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Refreshes the access token using the stored refresh token.
 * @returns Promise resolving to true if refresh succeeds, false otherwise.
 */
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getToken("refresh");
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${AUTH_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: HEADERS,
      credentials: "same-origin",
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data: RefreshTokenResponse = await response.json();
    if (!response.ok || !data.access) return false;

    storeToken(data.access, "access");
    return true;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return false;
  }
}

/**
 * Verifies the validity of the current access token.
 * Falls back to refreshing the token if verification fails.
 * @returns Promise resolving to true if token is valid or refreshed, false otherwise.
 */
export async function verifyToken(): Promise<boolean> {
  const accessToken = getToken("access");
  if (!accessToken) return false;

  const response = await fetch(`${AUTH_BASE_URL}/token/verify/`, {
    method: "POST",
    headers: HEADERS,
    credentials: "same-origin",
    body: JSON.stringify({ token: accessToken }),
  });

  if (!response.ok) return await refreshAccessToken();
  return true;
}

/**
 * Fetches the current user's details from the API.
 * @returns Promise resolving to the User object or null if the request fails.
 */
export async function getUser(): Promise<User | null> {
  const accessToken = getToken("access");
  if (!accessToken) return null;

  try {
    const response = await fetch(`${USER_BASE_URL}/detail/`, {
      method: "GET",
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "same-origin",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

/**
 * Logs out the current user by notifying the API and clearing tokens.
 * @returns Promise that resolves when logout is complete.
 */
export async function logout(): Promise<void> {
  const accessToken = getToken("access");
  if (!accessToken) {
    removeTokens(); // Clear tokens even if none exist
    return;
  }

  try {
    await protectedPostFetch(`${AUTH_BASE_URL}/logout/`, {
      token: accessToken,
    });
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("Logout failed");
  } finally {
    removeTokens();
  }
}