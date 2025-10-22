import { useCallback } from "react";
import axios from "axios";
import Environment from '../environment'
/**
 * Custom hook to fetch and redirect to a URL based on the current path.
 * 
 * @param {string} baseUrl - The base URL for the API request.
 * @returns {Function} - A function to fetch the URL and redirect.
 */
const useFetchAndRedirect = (urlName) => {
  const fetchAndRedirect = useCallback(async () => {
    try {
      const urlName = window.location.pathname;
    //   const apiUrl = `${baseUrl}/manageUrls/getUrls?urlName=${urlName}`;
      const apiUrl = `${Environment.BASE_URL}/manageUrls/getUrls?urlName=${urlName}`;
      console.log("🚀 ~ fetchAndRedirect ~ apiUrl:", apiUrl);
      
      const response = await axios.get(apiUrl);
      
      if (response?.data?.status && response.data?.data?.url) {
        const targetUrl = response.data.data.url;
        console.log("🚀 ~ fetchAndRedirect ~ targetUrl:", targetUrl);
        
        // Open the fetched URL in a new tab
        window.open(targetUrl, "_blank");
      } else {
        console.error("URL not found for the given urlName.");
      }
    } catch (error) {
      console.error("Error fetching the URL:", error);
    }
  }, [baseUrl]);

  return fetchAndRedirect;
};

export default useFetchAndRedirect;
