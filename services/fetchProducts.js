const fetchProducts = async (query) => {
    try {
      const response = await fetch(
        `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=us&language=en`, // Correct URL
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '986e0ce574msh4e5fc3b712bec59p1893ddjsnaffedc384ab2', // Your API key
            'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com', // Correct Host
          },
        }
      );
  
      // Check if the response was successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log('Product Search Response:', json);
  
      // Check for quota exceeded or any error message
      if (json.message?.toLowerCase().includes('quota')) {
        console.warn('⚠️ API quota exceeded:', json.message);
        return []; // You can display this error to the user in the UI
      }
  
      // Check if there are products
      if (json.products && json.products.length > 0) {
        return json.products; // Return products if found
      } else {
        console.warn('No products found for the query.');
        return []; // Return empty array if no products found
      }
  
    } catch (error) {
      console.error('API Fetch error:', error);
      return []; // Return empty array in case of error
    }
  };
  