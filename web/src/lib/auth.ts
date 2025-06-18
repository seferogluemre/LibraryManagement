export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
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
const LOGIN_TIMESTAMP_KEY = "loginTimestamp";

export function getAuthState(): AuthState {
  const user = localStorage.getItem(USER_STORAGE_KEY);
  return {
    accessToken: localStorage.getItem(ACCESS_STORAGE_KEY),
    refreshToken: localStorage.getItem(REFRESH_STORAGE_KEY),
    user: user ? JSON.parse(user) : null,
  };
}

export function setAuthState(data: UserLoginResponse) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
  localStorage.setItem(ACCESS_STORAGE_KEY, String(data.accessToken));
  localStorage.setItem(REFRESH_STORAGE_KEY, String(data.refreshToken));
  localStorage.setItem(LOGIN_TIMESTAMP_KEY, String(new Date().getTime()));
}

export function clearLocalStorageAuthState() {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ACCESS_STORAGE_KEY);
  localStorage.removeItem(REFRESH_STORAGE_KEY);
  localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
}

export const getAccessToken = () => {
  const accessToken = localStorage.getItem(ACCESS_STORAGE_KEY);
  return accessToken;
};

export const getLoginTimestamp = () => {
  const timestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
  return timestamp ? Number(timestamp) : null;
};

export const getRefreshToken = () => {
  const refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
  return refreshToken;
};

export const getLocalUser = () => {
  const user = localStorage.getItem(USER_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};
