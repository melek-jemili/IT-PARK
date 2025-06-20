import axios from 'axios';

export default function Delete() {
  const handleDelete = async () => {
    if (!window.confirm('Es-tu sûr(e) de vouloir supprimer ton compte ?')) return;
    const token = localStorage.getItem('access');
    try {
      await axios.delete('http://localhost:8000/api/Users/delete/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Compte supprimé');
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <h2>Supprimer mon compte</h2>
      <button onClick={handleDelete}>Supprimer définitivement</button>
    </div>
  );
}
