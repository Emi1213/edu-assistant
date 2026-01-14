import { HttpClient } from "./http-client";

export const httpClient = new HttpClient(
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
)
