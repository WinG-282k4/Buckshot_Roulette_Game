// API Configuration
export const getBackendUrl = (): string => {
  // Check for env variable first (Docker mode)
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // Fallback to hostname:80 for local dev (HTTP default port)
  const hostname = window.location.hostname;
  return `http://${hostname}:80`;
};

export const API_BASE_URL = getBackendUrl();
