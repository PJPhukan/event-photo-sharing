const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const appUrlFromEnv = import.meta.env.VITE_APP_URL?.trim();
const apiBaseFromEnv = import.meta.env.VITE_API_BASE_URL?.trim();

const browserOrigin =
  typeof window !== "undefined" ? trimTrailingSlash(window.location.origin) : "";

const APP_URL = appUrlFromEnv ? trimTrailingSlash(appUrlFromEnv) : browserOrigin;
const API_BASE_URL = apiBaseFromEnv ? trimTrailingSlash(apiBaseFromEnv) : "";

export { APP_URL, API_BASE_URL };
