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

function UnitsOverview() {
  const [totalUnits, setTotalUnits] = useState(null);
  const [unitsByGov, setUnitsByGov] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    axios
      .get("http://localhost:8000/api/unite/stats/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTotalUnits(res.data.Unités_Totales);
      })
      .catch((err) => console.error("Erreur stats total unités:", err));

    axios
      .get("http://localhost:8000/api/unite/statsParGouvernorat/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUnitsByGov(res.data);
      })
      .catch((err) => console.error("Erreur stats unités par gouvernorat:", err));
  }, []);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Statistiques des unités
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Données en temps réel
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox p={2}>
        {totalUnits !== null ? (
          <TimelineItem
            color="info"
            icon="apartment"
            title={`Unités totales : ${totalUnits}`}
            dateTime="Maintenant"
          />
        ) : (
          <MDTypography variant="body2" color="text">
            Chargement...
          </MDTypography>
        )}
      </MDBox>

      <MDBox p={2}>
        {unitsByGov && unitsByGov.length > 0 ? (
          <>
            <MDTypography variant="subtitle2" fontWeight="medium" gutterBottom>
              Répartition par gouvernorat :
            </MDTypography>

            <MDBox height={300}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={unitsByGov}
                    dataKey="total"
                    nameKey="gouvernorat"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {unitsByGov.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </MDBox>
          </>
        ) : (
          <MDTypography variant="body2" color="text">
            Chargement des données par gouvernorat...
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

export default UnitsOverview;
