import { useEffect, useState } from "react";
import axios from "axios";

import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";

function MaintenancesPersoOverview() {
  const [totalMaintenances, setTotalMaintenances] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("http://localhost:8000/api/maintenance/statsParPersonne/", { headers })
      .then((res) => {
        if (res.data.length > 0) {
          setTotalMaintenances(res.data[0].total);
        } else {
          setTotalMaintenances(0);
        }
      })
      .catch((err) => {
        console.error("Erreur maintenances par personne:", err);
        setTotalMaintenances(0);
      });
  }, []);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        p: 4,
      }}
    >
      <Icon sx={{ fontSize: 60, color: "info.main", mb: 1 }}>build_circle</Icon>
      <MDTypography variant="h4" fontWeight="bold" color="text">
        {totalMaintenances !== null ? totalMaintenances : "Chargement..."}
      </MDTypography>
      <MDTypography variant="subtitle1" color="textSecondary" mt={1}>
        Vos maintenances personnelles
      </MDTypography>
    </Card>
  );
}

export default MaintenancesPersoOverview;
