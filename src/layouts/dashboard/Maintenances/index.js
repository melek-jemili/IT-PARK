import { useEffect, useState } from "react";
import axios from "axios";

import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA00FF",
  "#FF4081",
  "#4DB6AC",
  "#FDD835",
  "#D32F2F",
  "#388E3C",
];

function MaintenancesOverview() {
  const [total, setTotal] = useState(null);
  const [byUnite, setByUnite] = useState([]);
  const [byEquipement, setByEquipement] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("http://localhost:8000/api/maintenance/stats/", { headers })
      .then((res) => {
        setTotal(res.data.Maintenances_Totales);
      })
      .catch((err) => console.error("Erreur total maintenances:", err));

    axios
      .get("http://localhost:8000/api/maintenance/statsParUnite/", { headers })
      .then((res) => setByUnite(res.data))
      .catch((err) => console.error("Erreur maintenances par unité:", err));

    axios
      .get("http://localhost:8000/api/maintenance/statsParEquipement/", { headers })
      .then((res) => setByEquipement(res.data))
      .catch((err) => console.error("Erreur maintenances par équipement:", err));
  }, []);

  const renderPie = (data, nameKey) => (
    <MDBox height={250}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </MDBox>
  );

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Statistiques des maintenances
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Données en temps réel
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox p={2}>
        {total !== null ? (
          <TimelineItem
            color="info"
            icon="build"
            title={`Maintenances totales : ${total}`}
            dateTime="Maintenant"
          />
        ) : (
          <MDTypography>Chargement...</MDTypography>
        )}
      </MDBox>

      <MDBox p={2}>
        <MDTypography variant="subtitle2" gutterBottom>
          Par unité :
        </MDTypography>
        {byUnite.length > 0 ? (
          renderPie(byUnite, "unite__codePostal")
        ) : (
          <MDTypography variant="body2" color="text">
            Chargement des unités...
          </MDTypography>
        )}
      </MDBox>

      <MDBox p={2}>
        <MDTypography variant="subtitle2" gutterBottom>
          Par équipement :
        </MDTypography>
        {byEquipement.length > 0 ? (
          renderPie(byEquipement, "codeEquipement__codeABarre")
        ) : (
          <MDTypography variant="body2" color="text">
            Chargement des équipements...
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

export default MaintenancesOverview;
