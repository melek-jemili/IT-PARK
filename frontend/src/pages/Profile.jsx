import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      alert('Vous n\'êtes pas connecté');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:8000/api/Users/profile/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(res => {
      setUser(res.data);
    })
    .catch(err => {
      console.error('Échec récupération profil:', err);
      alert('Échec de récupération du profil. Vérifie si tu es connecté.');
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div>
      <h2>Profil utilisateur</h2>
      {user ? (
        <div>
          <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
          <p><strong>Email :</strong> {user.email || 'Non renseigné'}</p>
          <p><strong>ID :</strong> {user.id}</p>
        </div>
      ) : (
        <p>Impossible de charger les données du profil.</p>
      )}
    </div>
  );
}
