
export type User = {
    id: string;
    name: string;
    email: string;
};

export type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
};

type UserLoginResponse = AuthState;

const USER_STORAGE_KEY = "user";
const ACCESS_STORAGE_KEY = "accessToken";
const REFRESH_STORAGE_KEY = "refreshToken";

export function getAuthState(): AuthState {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return {
        accessToken: localStorage.getItem(ACCESS_STORAGE_KEY),
        refreshToken: localStorage.getItem(REFRESH_STORAGE_KEY),
        user: user ? JSON.parse(user) : null,
    };
}

export function setAuthState(data: UserLoginResponse) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
    localStorage.setItem(ACCESS_STORAGE_KEY, String(data.accessToken))
    localStorage.setItem(REFRESH_STORAGE_KEY, String(data.refreshToken))
}

export function clearLocalStorageAuthState() {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ACCESS_STORAGE_KEY);
    localStorage.removeItem(REFRESH_STORAGE_KEY);
}