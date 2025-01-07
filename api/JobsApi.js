import axios from 'axios';

const BASE_URL = 'https://testapi.getlokalapp.com/common/jobs?page=1';

export const fetchJobs = async (page) => {
  try {
    const response = await axios.get(`${BASE_URL}${page}`);
    if (response && response.data && Array.isArray(response.data.jobs)) {
      return response.data.jobs; 
    }
    return []; 
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};
