import { useEffect, useState } from "react";
import axios from "axios";

// @mui components
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

const STATUT_COLORS = {
  fonctionnel: "#4caf50", // vert
  "en panne": "#f44336", // rouge
  "hors-service": "#ffeb3b", // jaune
  autre: "#9e9e9e", // gris
};

function EquipementsOverview() {
  const [total, setTotal] = useState(null);
  const [byUnite, setByUnite] = useState([]);
  const [byStatut, setByStatut] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("http://localhost:8000/api/equipements/stats/", { headers })
      .then((res) => {
        setTotal(res.data.Equipements_Totales);
      })
      .catch((err) => console.error("Erreur total équipements:", err));

    axios
      .get("http://localhost:8000/api/equipements/statsParUnite/", { headers })
      .then((res) => setByUnite(res.data))
      .catch((err) => console.error("Erreur équipements par unité:", err));

    axios
      .get("http://localhost:8000/api/equipements/statsParStatut/", { headers })
      .then((res) => setByStatut(res.data))
      .catch((err) => console.error("Erreur équipements par statut:", err));
  }, []);

  // Fonction pour fusionner codePostal + nom en label
  const mergeLabel = (data, codeField, nameField) =>
    data.map((item) => ({
      ...item,
      label: `${item[codeField]} - ${item[nameField]}`,
    }));

  // Génère un PieChart pour un dataset donné
  const renderPie = (data, nameKey, colorFn) => (
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
              <Cell key={`cell-${index}`} fill={colorFn(entry, index)} />
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
          Statistiques des équipements
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
            color="primary"
            icon="memory"
            title={`Équipements totaux : ${total}`}
            dateTime="Maintenant"
          />
        ) : (
          <MDTypography>Chargement...</MDTypography>
        )}
      </MDBox>

      <MDBox p={2}>
        <MDTypography variant="subtitle2">Par unité :</MDTypography>
        {byUnite.length > 0 ? (
          renderPie(
            mergeLabel(byUnite, "unite__codePostal", "unite__nom"),
            "label",
            (_, i) => COLORS[i % COLORS.length]
          )
        ) : (
          <MDTypography variant="body2" color="text">
            Chargement des unités...
          </MDTypography>
        )}
      </MDBox>

      <MDBox p={2}>
        <MDTypography variant="subtitle2">Par statut :</MDTypography>
        {byStatut.length > 0 ? (
          renderPie(
            byStatut,
            "etat",
            (entry) => STATUT_COLORS[entry.etat?.toLowerCase()] || STATUT_COLORS.autre
          )
        ) : (
          <MDTypography variant="body2" color="text">
            Chargement des statuts...
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

export default EquipementsOverview;
