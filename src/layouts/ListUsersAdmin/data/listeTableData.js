import React, { useState, useEffect } from "react";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";
import axios from "axios";

export default function useProfileTableData(onChangePasswordClick) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Matricule", accessor: "matricule", width: "10%", align: "left" },
      { Header: "Nom", accessor: "nom", width: "10%", align: "left" },
      { Header: "Prenom", accessor: "prenom", width: "10%", align: "left" },
      { Header: "CIN", accessor: "cin", width: "10%", align: "left" },
      { Header: "Email", accessor: "email", width: "15%", align: "left" },
      { Header: "Téléphone", accessor: "telephone", width: "10%", align: "left" },
      { Header: "Unité", accessor: "unite", width: "10%", align: "left" },
      { Header: "Fonction", accessor: "fonction", width: "10%", align: "left" },
      { Header: "Naissance", accessor: "dateNaissance", width: "10%", align: "left" },
      { Header: "Région", accessor: "region", width: "10%", align: "left" },
      { Header: "Mot de passe", accessor: "actions", align: "center" }, // 🔑 nouvelle colonne
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
            <MDTypography variant="button" fontWeight="medium">
              {profile.nom}
            </MDTypography>
          ),
          prenom: (
            <MDTypography variant="button" fontWeight="medium">
              {profile.prenom}
            </MDTypography>
          ),
          cin: (
            <MDTypography variant="button" fontWeight="medium">
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
          fonction: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {profile.fonction ?? "N/A"}
            </MDTypography>
          ),
          dateNaissance: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {profile.dateNaissance ?? "N/A"}
            </MDTypography>
          ),
          region: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {profile.region ?? "N/A"}
            </MDTypography>
          ),
          actions: (
            <Button
              variant="outlined"
              sx={{
                color: "#1a73e8",
                borderColor: "#1a73e8",
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => onChangePasswordClick(profile)}
            >
              Changer mot de passe
            </Button>
          ),
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
  }, [onChangePasswordClick]);

  return tableData;
}
