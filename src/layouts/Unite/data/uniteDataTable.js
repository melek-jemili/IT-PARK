/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Images
import team2 from "assets/images/team-2.jpg";
import badge from "assets/images/la-poste-tunisienne-logo-png_seeklogo-359957.ico";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useUniteTableData(userId, handleVoir) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Unité", accessor: "unite", width: "40%", align: "left" },
      { Header: "Classe", accessor: "classe", align: "center" },
      { Header: "Gouvernorat", accessor: "gouvernorat", align: "center" },
      { Header: "Employés", accessor: "nombreEmployes", align: "center" },
      { Header: "Voir", accessor: "details", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchUnites = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://localhost:8000/api/unite/list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const unites = response.data;

        const rows = unites.map((unite) => ({
          // Colonnes visibles dans le tableau
          unite: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
              <MDAvatar src={badge} name={unite.nom} size="sm" />
              <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                  {unite.nom}
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  Code Postal: {unite.codePostal}
                </MDTypography>
              </MDBox>
            </MDBox>
          ),
          classe: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {unite.classe}
            </MDTypography>
          ),
          gouvernorat: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {unite.gouvernorat}
            </MDTypography>
          ),
          nombreEmployes: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {unite.nombreEmployes}
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
              onClick={() => handleVoir(unite.codePostal)}
            >
              Voir
            </MDTypography>
          ),

          // Données brutes à passer à row.original
          nom: unite.nom,
          codePostal: unite.codePostal,
          classe: unite.classe,
          gouvernorat: unite.gouvernorat,
          nombreEmployes: unite.nombreEmployes,
          adresse: unite.adresse,
          nombreGuichets: unite.nombreGuichets,
          chefUnité: unite.chefUnité,
          typeLiason1: unite.typeLiason1,
          typeLiason2: unite.typeLiason2,
          idLiaison1: unite.idLiaison1,
          idLiaison2: unite.idLiaison2,
          plageIP: unite.plageIP,
        }));

        setTableData((prev) => ({
          ...prev,
          rows,
        }));
      } catch (error) {
        console.error("❌ Erreur récupération unités :", error);
        setTableData((prev) => ({
          ...prev,
          rows: [],
        }));
      }
    };

    fetchUnites();
  }, [userId]);

  return tableData;
}
