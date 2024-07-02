import React, { useState } from 'react';
import axios from 'axios';

const RoutesSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState([]);

  const handleSearch = async () => {
    try {
      const translinkResponse = await axios.get(`${process.env.REACT_APP_TRANSLINK_API_ENDPOINT}`, {
        params: { search: searchTerm, key: process.env.REACT_APP_API_KEY }
      });
      const googleResponse = await axios.get(`${process.env.REACT_APP_GOOGLE_API_ENDPOINT}`, {
        params: { search: searchTerm, key: process.env.REACT_APP_API_KEY }
      });

      setRoutes([...translinkResponse.data, ...googleResponse.data]);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search for routes"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {routes.map((route, index) => (
          <li key={index}>{route.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RoutesSearch;
