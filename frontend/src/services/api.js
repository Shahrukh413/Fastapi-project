import API_BASE_URL, { API_ENDPOINTS } from "../config";

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  
  return data;
};

// Auth API calls
export const authAPI = {
  // Signup
  signup: async (username, email, password) => {
    const response = await fetch(API_ENDPOINTS.signup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(API_ENDPOINTS.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Get current user profile
  getProfile: async (token) => {
    const response = await fetch(API_ENDPOINTS.me, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

export default authAPI;