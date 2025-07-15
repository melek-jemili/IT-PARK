import React, { useState, useEffect } from "react";
import MDTypography from "components/MDTypography";
import axios from "axios";

export default function useProfileTableData(handleVoir) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Matricule", accessor: "matricule", width: "15%", align: "left" },
      { Header: "Nom", accessor: "nom", width: "25%", align: "left" },
      { Header: "Prenom", accessor: "prenom", width: "25%", align: "left" },
      { Header: "CIN", accessor: "cin", width: "15%", align: "left" },
      { Header: "Email", accessor: "email", width: "20%", align: "left" },
      { Header: "Téléphone", accessor: "telephone", width: "15%", align: "left" },
      { Header: "Unité", accessor: "unite", width: "15%", align: "center" },
      { Header: "Détails", accessor: "details", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://localhost:8000/api/Users/list/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profiles = response.data;

        const rows = profiles.map((profile) => ({
          matricule: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {profile.matricule}
            </MDTypography>
          ),
          nom: (
            <MDTypography display="block" variant="button" fontWeight="medium">
              {profile.nom}
            </MDTypography>
          ),
          prenom: (
            <MDTypography display="block" variant="button" fontWeight="medium">
              {profile.prenom}
            </MDTypography>
          ),
          cin: (
            <MDTypography display="block" variant="button" fontWeight="medium">
              {profile.cin}
            </MDTypography>
          ),
          email: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {profile.email}
            </MDTypography>
          ),
          telephone: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {profile.telephone}
            </MDTypography>
          ),
          unite: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {profile.unite ?? "N/A"}
            </MDTypography>
          ),
          details: (
            <MDTypography
              component="button"
              type="button"
              variant="caption"
              color="text"
              fontWeight="medium"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => typeof handleVoir === "function" && handleVoir(profile.matricule)}
            >
              Voir
            </MDTypography>
          ),

          // Données brutes si besoin
          matriculeRaw: profile.matricule,
          nom: profile.nom,
          prenom: profile.prenom,
          cin: profile.cin,
          fonction: profile.fonction,
          dateNaissance: profile.dateNaissance,
          region: profile.region,
          emailRaw: profile.email,
          telephoneRaw: profile.telephone,
          uniteRaw: profile.unite,
          userId: profile.matricule,
        }));

        setTableData((prev) => ({
          ...prev,
          rows,
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des profils :", error);
        setTableData((prev) => ({
          ...prev,
          rows: [],
        }));
      }
    };

    fetchProfiles();
  }, []); // <-- ici : on ne met plus userId pour éviter boucle infinie

  return tableData;
}
