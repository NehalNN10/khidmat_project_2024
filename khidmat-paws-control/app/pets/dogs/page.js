'use client';

import { useState, useEffect } from 'react';

export default function DogsPage() {
    const [dogs, setDogs] = useState([]); // State to store the dogs
    const [error, setError] = useState(null); // State to store errors

    useEffect(() => {
        // Fetch the dogs data from the API
        async function fetchDogs() {
            try {
                const response = await fetch('/api/pages/dogs'); // Call the API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch dogs');
                }
                const data = await response.json();
                setDogs(data); // Set the dogs in state
            } catch (error) {
                setError(error.message); // Set the error in state
            }
        }
        fetchDogs();
    }, []);

    if (error) {
        return <p>Error: {error}</p>; // Render error message if any
    }

    if (dogs.length === 0) {
        return <p>Loading...</p>; // Show loading state
    }

    return (
        <div>
            <h1>Available Dogs</h1>
            <ul>
                {dogs.map((dog) => (
                    <li key={dog.animal_id}>
                        <h2>{dog.name}</h2>
                        <p>{dog.description}</p>
                        <p>Status: {dog.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
