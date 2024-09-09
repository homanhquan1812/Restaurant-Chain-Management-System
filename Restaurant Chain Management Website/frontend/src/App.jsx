import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [restaurantData, setRestaurantData] = useState([]);
  const [staffData, setStaffData] = useState({});

  useEffect(() => {
    // Function to fetch initial restaurant data
    const fetchRestaurantData = async () => {
      const response = await fetch('http://localhost:5000/datahandling/4j5k1v9n2b8p7x6r3c0w1m7y8d2f6g');
      if (response.status === 200) {
        console.log('Restaurant data fetched successfully.');
        const data = await response.json();
        setRestaurantData(data.restaurant_data);
      }
    };

    fetchRestaurantData();
  }, []);

  useEffect(() => {
    // Function to fetch staff data based on staff_url
    const fetchStaffData = async (url) => {
      const response = await fetch(url);
      if (response.status === 200) {
        console.log(`Data fetched successfully from ${url}.`);
        const data = await response.json();
        setStaffData((prev) => ({
          ...prev,
          [url]: data
        }));
      }
    };

    // Fetch data for each staff_url
    restaurantData.forEach(data => {
      if (data.staff_url) {
        fetchStaffData(data.staff_url);
      }
    });
  }, [restaurantData]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        {restaurantData.map((data, index) => {
          const currentStaffData = staffData[data.staff_url]; // Store the staff data in a variable
          
          // Check if currentStaffData is not undefined and has a "staff" array
          if (currentStaffData && currentStaffData.staff) {
            return (
              <div key={index}>
                <h2>Staff Data from {data.staff_url}</h2>
                <div>
                  {currentStaffData.staff.map((staffMember, idx) => (
                    <div key={idx}>
                      <p>Name: {staffMember.name}</p>
                      <p>Gender: {staffMember.gender}</p>
                      <p>Email: {staffMember.email}</p>
                      <p>Position: {staffMember.position || 'Not Assigned'}</p>
                      <p>Role: {staffMember.role}</p>
                      <hr />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </p>
    </>
  );
}

export default App;
