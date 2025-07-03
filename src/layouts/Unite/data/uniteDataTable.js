/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useUniteTableData(userId, handleVoir) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Unité", accessor: "unite", width: "45%", align: "left" },
      { Header: "Classe", accessor: "classe", align: "center" },
      { Header: "Gouvernorat", accessor: "gouvernorat", align: "center" },
      { Header: "Nombre d'employés", accessor: "nombreEmployes", align: "center" },
      { Header: "Adresse", accessor: "adresse", align: "center" },
      { Header: "Détails", accessor: "details", align: "center" },
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
          unite: (
            <MDBox lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
                {unite.nom} (Code Postal: {unite.codePostal})
              </MDTypography>
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
          adresse: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {unite.adresse}
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
        }));

        setTableData((prev) => ({
          ...prev,
          rows,
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des unités :", error);
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
