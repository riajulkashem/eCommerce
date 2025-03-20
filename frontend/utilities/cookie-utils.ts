import Cookies from "js-cookie";
import {User} from "@/utilities/types";

/**
 * Stores a token in cookies.
 * @param {string} token - The token to be stored.
 * @param {"access" | "refresh"} type - The type of the token (access or refresh).
 */
export const storeToken = (token: string, type: "access" | "refresh") => {
    Cookies.set(type + "Token", token);
};

// TODO: Implement this to avoid much request in backend for user detail
export const storeUser = (user: User) => {
    Cookies.set('user', JSON.stringify(user));
}
export const getUserFromCookie = () => {
    Cookies.get("user")
}

/**
 * Retrieves a token from cookies.
 * @param {"access" | "refresh"} type - The type of the token to retrieve (access or refresh).
 * @returns {string | undefined} The token, if not found.
 */
export const getToken = (type: "access" | "refresh"): string | undefined => {
    return Cookies.get(type + "Token");
};

/**
 * Removes both access and refresh tokens from cookies.
 */
export const removeTokens = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
};
