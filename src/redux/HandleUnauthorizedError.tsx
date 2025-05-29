
export const handleUnauthorizedError = async (error: any) => {
  if (error.response) {
    if (error.response.status === 401) {
     ;
      return 'Unauthorized. Please log in again.';
    }
    return error.response.data.message || 'An error occurred';
  }
  return error.message || 'Network error';
};
