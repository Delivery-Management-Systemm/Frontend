// User API Service
import { API_CONFIG } from "../config/api";
import { fetchWithRetry } from "../utils/apiUtils";

class UserAPI {
  // Get all users with pagination
  async getAllUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber);
      if (params.pageSize) queryParams.append("pageSize", params.pageSize);
      if (params.role) queryParams.append("role", params.role);
      if (params.department)
        queryParams.append("department", params.department);
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);

      const response = await fetchWithRetry(
        `${API_CONFIG.BASE_URL}/User/all?${queryParams}`,
        {
          method: "GET",
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await fetchWithRetry(
        `${API_CONFIG.BASE_URL}/User/${userId}`,
        {
          method: "GET",
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  // Update user profile
  async updateUser(userId, userData) {
    try {
      const response = await fetchWithRetry(
        `${API_CONFIG.BASE_URL}/User/${userId}`,
        {
          method: "PUT",
          headers: API_CONFIG.getAuthHeaders(),
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const response = await fetchWithRetry(
        `${API_CONFIG.BASE_URL}/User/${userId}`,
        {
          method: "DELETE",
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Get user role options
  async getUserRoles() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/User/options/roles`,
        {
          method: "GET",
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user roles:", error);
      throw error;
    }
  }

  // Get department options
  async getDepartments() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/User/options/departments`,
        {
          method: "GET",
          headers: API_CONFIG.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  }
}

const userAPIInstance = new UserAPI();
export default userAPIInstance;
