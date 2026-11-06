export { refreshAccessToken } from "./http";

export interface RefreshTokenResponse {
  success?: boolean;
  message?: string;
}