export const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "/api";
