import { useState } from 'react';
import API from '../services/Api'; // Use your configured Axios instance

export default function ChangePass() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleChange = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    try {
      await API.put('change_password/', {
        old_password: oldPass,
        new_password: newPass
      });
      alert('Mot de passe modifié');
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err) {
      console.error(err);
      alert('Erreur : mot de passe incorrect ou autre');
    }
  };

  return (
    <form onSubmit={handleChange}>
      <h2>Changer le mot de passe</h2>
      <input
        type="password"
        placeholder="Ancien mot de passe"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirmer le nouveau mot de passe"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
        required
      />
      <button type="submit">Changer</button>
    </form>
  );
}
