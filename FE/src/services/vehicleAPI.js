
const API_BASE_URL = 'http://localhost:5064/api'; // Backend API base URL

/**
 * Get all vehicles from the backend
 * @returns {Promise<Array>} Array of vehicle objects
 */
export const getVehicles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Vehicle`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

/**
 * Get vehicle by ID
 * @param {number} vehicleId - The vehicle ID
 * @returns {Promise<Object>} Vehicle object
 */
export const getVehicleById = async (vehicleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Vehicle/${vehicleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
};
