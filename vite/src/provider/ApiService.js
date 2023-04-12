function apiBaseUrl(path) {
  path = import.meta.env.VITE_BASE_API_URL + path;
  path = path.replace(/([^:]\/)\/+/g, "$1");
  return path;
}

function baseUrl(path) {
  path = import.meta.env.VITE_BASE_URL + path;
  path = path.replace(/([^:]\/)\/+/g, "$1");
  return path;
}

export { apiBaseUrl, baseUrl };
