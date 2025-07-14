/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Images
import team2 from "assets/images/team-2.jpg";
import badge from "assets/images/la-poste-tunisienne-logo-png_seeklogo-359957.ico";

export default function useMaintenanceTableData(userId, handleVoirMaintenance) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "maintenance", accessor: "maintenance", width: "45%", align: "left" },
      { Header: "unite", accessor: "unite", align: "center" },
      { Header: "created", accessor: "created", align: "center" },
      { Header: "details", accessor: "details", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://localhost:8000/api/maintenance/list-for-user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const maintenances = response.data;
        const rows = maintenances.map((maintenance) => ({
          maintenance: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
              <MDAvatar src={badge} name={maintenance.idMaintenance} size="sm" />
              <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                  Identifiant : {maintenance.idMaintenance}
                </MDTypography>
                <MDTypography variant="caption">{maintenance.diagnostique}</MDTypography>
              </MDBox>
            </MDBox>
          ),
          unite: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {maintenance.unite}
            </MDTypography>
          ),
          created: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {new Date(maintenance.datecréation).toLocaleDateString()}
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
              onClick={() => handleVoirMaintenance(maintenance.idMaintenance)}
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
        console.error("Erreur lors de la récupération des maintenances :", error);
        if (isMounted) {
          setTableData((prev) => ({
            ...prev,
            rows: [],
          }));
        }
      }
    };

    fetchMaintenances();
  }, [userId]);

  return tableData;
}
