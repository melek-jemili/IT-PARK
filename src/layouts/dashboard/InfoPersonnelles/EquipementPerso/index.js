import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import DevicesIcon from "@mui/icons-material/Devices"; // Symbole d'équipement

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
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "60vh",
        background: "transparent",
        paddingLeft: "25vw", // 2x plus de décalage à gauche
      }}
    >
      <Card
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          minWidth: "320px",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <DevicesIcon style={{ fontSize: 40, color: "#1976d2" }} />
        </div>
        <h3 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Mes équipements</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {equipements.map((eq) => (
            <li key={eq.codeABarre} style={{ marginBottom: "1rem", textAlign: "center" }}>
              {eq.nom} : {eq.modele} ({eq.etat})
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default EquipementsUser;
