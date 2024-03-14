function apiBaseUrl(path) {
  const mode = import.meta.env.VITE_ENVIRONTMENT;

  if(mode == "local") {
    path = import.meta.env.VITE_LOCAL_BASE_API_URL + path;
  } else if(mode == "staging") {
    path = import.meta.env.VITE_STAGING_BASE_API_URL + path;
  } else if(mode == "production") {
    path = import.meta.env.VITE_PRODUCTION_BASE_API_URL + path;
  }

  path = path.replace(/([^:]\/)\/+/g, "$1");
  return path;
}

function baseUrl(path) {
  const mode = import.meta.env.VITE_ENVIRONTMENT;
  if(mode == "local") {
    path = import.meta.env.VITE_LOCAL_BASE_URL + path;
  } else if(mode == "staging") {
    path = import.meta.env.VITE_STAGING_BASE_URL + path;
  } else if(mode == "production") {
    path = import.meta.env.VITE_PRODUCTION_BASE_URL + path;
  }

  path = path.replace(/([^:]\/)\/+/g, "$1");
  return path;
}

export { apiBaseUrl, baseUrl };
