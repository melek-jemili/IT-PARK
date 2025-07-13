import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a29bfe"];

function UsersOverview() {
  const [total, setTotal] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");

    axios
      .get("http://localhost:8000/api/Users/statsTotal/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTotal(res.data.total))
      .catch((err) => console.error("Erreur statsTotal:", err));

    axios
      .get("http://localhost:8000/api/Users/statsCategorie/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Erreur statsCategorie:", err));
  }, []);

  const chartData =
    categories &&
    Object.entries(categories).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Statistiques des utilisateurs
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              Données en temps réel
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>
      {/* Graphique PieChart sans flèches ni texte externe */}
      {chartData && (
        <MDBox p={4} height={320}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </MDBox>
      )}
    </Card>
  );
}

export default UsersOverview;
