/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import badge from "assets/images/la-poste-tunisienne-logo-png_seeklogo-359957.ico";

import React, { useState, useEffect } from "react";
import axios from "axios";

// Fonction utilitaire pour colorer le champ état
const coloredEtatChip = (etat) => {
  let color = "default";
  const formatted = etat.toLowerCase();

  if (formatted === "fonctionnel") color = "success";
  else if (formatted === "hors-service") color = "error";
  else if (formatted === "en panne") color = "warning";

  return <MDBadge badgeContent={etat} color={color} variant="gradient" size="sm" />;
};

export default function useEquipementTableData(userId, handleVoir) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "Équipement", accessor: "equipement", width: "45%", align: "left" },
      { Header: "Unité", accessor: "unite", align: "center" },
      { Header: "Date de mise en service", accessor: "dateMiseEnService", align: "center" },
      {
        Header: "État",
        accessor: "etat",
        align: "center",
        Cell: ({ value }) => coloredEtatChip(value),
      },
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
              <MDAvatar src={badge} name={equipement.nom} size="sm" />
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
          etat: coloredEtatChip(equipement.etat),
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

          // Données brutes utiles pour modification
          codeABarre: equipement.codeABarre,
          nom: equipement.nom,
          numeroSerie: equipement.numeroSerie,
          modele: equipement.modele,
          marque: equipement.marque,
          type: equipement.type,
          etat: equipement.etat,
          dateMiseEnService: equipement.dateMiseEnService,
          adresseIP: equipement.adresseIP,
          adresseMAC: equipement.adresseMAC,
          uniteId: equipement.unite,
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
