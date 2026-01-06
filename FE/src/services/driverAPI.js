
const API_BASE_URL = 'http://localhost:5064/api'; 

/**
 * Get all drivers from the backend
 * @returns {Promise<Array>} Array of driver objects
 */
export const getDrivers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Driver`, {
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
    console.error('Error fetching drivers:', error);
    throw error;
  }
};

/**
 * Get driver history by driver ID
 * @param {number} driverId - The driver ID
 * @returns {Promise<Array>} Array of driver history objects
 */
export const getDriverHistory = async (driverId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Driver/${driverId}/history`, {
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
    console.error('Error fetching driver history:', error);
    throw error;
  }
};

/**
 * Get driver by ID
 * @param {number} driverId - The driver ID
 * @returns {Promise<Object>} Driver object
 */
export const getDriverById = async (driverId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Driver/${driverId}`, {
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
    console.error('Error fetching driver:', error);
    throw error;
  }
};
