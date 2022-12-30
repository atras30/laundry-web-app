function apiBaseUrl(path) {
  path = process.env.REACT_APP_BASE_API_URL + path;
  path = path.replace(/([^:]\/)\/+/g, "$1");
  return path;
}

function baseUrl(path) {
  path = process.env.REACT_APP_BASE_URL + path;
  path = path.replace(/([^:]\/)\/+/g, "$1");
  return path;
}

export { apiBaseUrl, baseUrl };
