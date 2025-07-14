import React, { useEffect, useState } from "react";
import axios from "axios";

function EquipementsUser() {
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipements = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get("http://localhost:8000/api/equipements/list-for-user/", {
          headers,
        });
        setEquipements(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des équipements.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipements();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Mes équipements (unité)</h3>
      <ul>
        {equipements.map((eq) => (
          <li key={eq.codeABarre}>
            {eq.nom} - {eq.modele} - {eq.etat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EquipementsUser;
