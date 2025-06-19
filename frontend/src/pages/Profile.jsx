import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) return;

    axios.get('http://localhost:8000/api/Users/profile/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(res => setUser(res.data))
    .catch(err => {
      console.error('Failed to fetch profile:', err);
      alert('You are not logged in or session expired');
    });
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
// This code defines a Profile component that fetches and displays the user's profile information.
// It uses the useEffect hook to make an API call to fetch the user's profile data when the component mounts.
// If the user is logged in, it displays their username, email, and ID.