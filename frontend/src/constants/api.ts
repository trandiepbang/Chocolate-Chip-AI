export const API_URL =
  process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:3000";

export const WEBSOCKET_URL =
  process.env["NEXT_PUBLIC_WEBSOCKET_URL"] || "http://localhost:3000";
export const VERSION = "v1";
export const API_BASE_URL = `${API_URL}/api/${VERSION}`;
export const WEBSOCKET_BASE_URL=`${WEBSOCKET_URL}/api/${VERSION}`