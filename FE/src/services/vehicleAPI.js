// Vehicle API Service
import { API_CONFIG } from "../config/api";
import { fetchWithRetry } from "../utils/apiUtils";

class VehicleAPI {
  // Get all vehicles
  async getAllVehicles() {
    try {
      const response = await fetchWithRetry(`${API_CONFIG.BASE_URL}/Vehicle`, {
        method: "GET",
        headers: API_CONFIG.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  }

  // Get vehicle details by ID
  async getVehicleDetails(vehicleId) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/Vehicle/${vehicleId}`,
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
      console.error("Error fetching vehicle details:", error);
      throw error;
    }
  }

  // Create new vehicle
  async createVehicle(vehicleData) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/Vehicle`, {
        method: "POST",
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw error;
    }
  }
}

const vehicleAPIInstance = new VehicleAPI();

// Export both the class instance and individual functions for backward compatibility
export default vehicleAPIInstance;

// Export individual functions that existing code expects
export const getVehicles = () => vehicleAPIInstance.getAllVehicles();
export const getVehicleDetails = (vehicleId) =>
  vehicleAPIInstance.getVehicleDetails(vehicleId);
export const createVehicle = (vehicleData) =>
  vehicleAPIInstance.createVehicle(vehicleData);
