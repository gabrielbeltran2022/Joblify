export interface RefreshTokenResponse {
  success?: boolean;
  message?: string;
}

export const refreshAccessToken = async (): Promise<void> => {
  const response = await fetch("http://localhost:3000/api/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      `Failed to refresh token (Status: ${response.status})`
    );
  }
};