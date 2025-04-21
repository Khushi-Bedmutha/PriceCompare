// src/services/api.js
import axios from 'axios';

const fetchProducts = async (query = 'laptop') => {
  try {
    const response = await axios.get(
      'https://real-time-product-search.p.rapidapi.com/search', // Correct API URL
      {
        params: {
          q: query,
          country: 'us',
          language: 'en',
        },
        headers: {
          'X-RapidAPI-Key': '986e0ce574msh4e5fc3b712bec59p1893ddjsnaffedc384ab2', // API key
          'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com', // Correct Host
        },
      }
    );

    // Return products or an empty array if no products are found
    return response.data.products || [];
  } catch (error) {
    console.error('API error:', error.message);
    throw new Error('Failed to fetch products');
  }
};

export { fetchProducts };
