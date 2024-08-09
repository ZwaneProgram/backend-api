'use client';

import { useEffect, useState } from 'react';

export default function Page() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await fetch('https://backend-api-gules.vercel.app/api/users');
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

        getUsers();
        const interval = setInterval(getUsers, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Fetched Users</h1>
                <ul className="space-y-4">
                    {items.map((item, index) => (
                        <li key={index} className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
                            <div className="ml-4">
                            <p className="text-lg font-bold text-gray-700">ItemId: { item.id}</p>
                                <p className="text-lg font-semibold text-gray-700">Username: { item.username}</p>
                                <p className="text-gray-500">FirstName: {item.firstname}</p>
                                <p className="text-gray-500">LastName: {item.lastname}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
