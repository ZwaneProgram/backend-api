'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    async function getUsers() {
      try {
        const res = await fetch('http://localhost:3000/api/users');
        if (!res.ok) {
          console.error('Failed to fetch data');
          return;
        }
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
 
  getUsers()
  const interval  = setInterval(getUsers, 1000);
  return () => clearInterval(interval );
}, []);

  return (
    <div>
      <br /><br /><br /><br />
      <h1>Fetched Users</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <strong>{item.firstname}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}