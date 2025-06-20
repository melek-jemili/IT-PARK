import { useEffect, useState } from 'react';
import axios from 'axios';

export default function List() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    axios.get('http://localhost:8000/api/Users/list/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data))
    .catch(err => {
      console.error(err);
      alert('Accès refusé ou erreur serveur');
    });
  }, []);

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} — {u.email || 'Aucun email'}
          </li>
        ))}
      </ul>
    </div>
  );
}
