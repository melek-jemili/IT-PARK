import { useEffect, useState } from "react";
import axios from "axios";

import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";

function TicketPersoOverview() {
  const [totalTickets, setTotalTickets] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get("http://localhost:8000/api/ticket/statParUtilisateur/", { headers })
      .then((res) => {
        if (res.data.length > 0) {
          setTotalTickets(res.data[0].total);
        }
      })
      .catch((err) => console.error("Erreur tickets par personne:", err));
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
      <Icon sx={{ fontSize: 60, color: "primary.main", mb: 1 }}>confirmation_number</Icon>
      <MDTypography variant="h4" fontWeight="bold" color="text">
        {totalTickets !== null ? totalTickets : "Chargement..."}
      </MDTypography>
      <MDTypography variant="subtitle1" color="textSecondary" mt={1}>
        Vos tickets personnels
      </MDTypography>
    </Card>
  );
}

export default TicketPersoOverview;
