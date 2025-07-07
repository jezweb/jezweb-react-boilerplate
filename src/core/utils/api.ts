export const isAuthUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  const authUrls = ['login', 'register', 'refresh', 'forgot-password'];
  return authUrls.some(authUrl => url.includes(authUrl));
};

export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(key, String(item)));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};