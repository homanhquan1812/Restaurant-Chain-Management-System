const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

if (!BASE_API_URL) {
  console.warn("⚠️ VITE_BASE_API_URL is not set in .env file!");
}

const config = {
  BASE_API_URL: BASE_API_URL || ""
};

export default config;
