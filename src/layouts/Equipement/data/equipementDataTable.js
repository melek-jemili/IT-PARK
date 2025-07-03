/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useEquipementTableData(userId, handleVoir) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Équipement", accessor: "equipement", width: "45%", align: "left" },
      { Header: "Unité", accessor: "unite", align: "center" },
      { Header: "Date de mise en service", accessor: "dateMiseEnService", align: "center" },
      { Header: "État", accessor: "etat", align: "center" },
      { Header: "Détails", accessor: "details", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchEquipements = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://localhost:8000/api/equipements/list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const equipements = response.data;
        const rows = equipements.map((equipement) => ({
          equipement: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
              <MDAvatar src={team2} name={equipement.nom} size="sm" />
              <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                  {equipement.nom} (Code: {equipement.codeABarre})
                </MDTypography>
                <MDTypography variant="caption">{equipement.modele}</MDTypography>
              </MDBox>
            </MDBox>
          ),
          unite: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {equipement.unite}
            </MDTypography>
          ),
          dateMiseEnService: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {new Date(equipement.dateMiseEnService).toLocaleDateString()}
            </MDTypography>
          ),
          etat: (
            <MDBadge
              badgeContent={equipement.etat}
              color={
                equipement.etat.toLowerCase() === "fonctionnel"
                  ? "success"
                  : equipement.etat.toLowerCase() === "hors service"
                  ? "error"
                  : "warning"
              }
              variant="gradient"
              size="sm"
            />
          ),
          details: (
            <MDTypography
              component="button"
              type="button"
              variant="caption"
              color="text"
              fontWeight="medium"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => handleVoir(equipement.codeABarre)}
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
        console.error("Erreur lors de la récupération des équipements :", error);
        setTableData((prev) => ({
          ...prev,
          rows: [],
        }));
      }
    };

    fetchEquipements();
  }, [userId]);

  return tableData;
}
