import axios from 'axios';

const BASE_URL = 'https://testapi.getlokalapp.com/common/jobs?page=1';

// Fetch jobs function
export const fetchJobs = async (page) => {
  try {
    const response = await axios.get(`${BASE_URL}${page}`);
    if (response && response.data && Array.isArray(response.data.jobs)) {
      return response.data.jobs; // Return jobs if valid
    }
    return []; // Return an empty array if data is invalid
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};
