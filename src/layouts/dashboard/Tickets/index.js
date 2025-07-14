import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Couleurs fixes pour statut
const STATUS_COLORS = {
  ouvert: "#f44336",
  encours: "#ffeb3b",
  fermé: "#4caf50",
  autre: "#9e9e9e",
};

const DEFAULT_COLORS = [
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

function TicketsOverview() {
  const [total, setTotal] = useState(null);
  const [byStatus, setByStatus] = useState([]);
  const [byUnite, setByUnite] = useState([]);
  const [byEquipement, setByEquipement] = useState([]);
  const [byPriorite, setByPriorite] = useState([]);
  const [byPersonne, setByPersonne] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("http://localhost:8000/api/ticket/stats/", { headers })
      .then((res) => setTotal(res.data.Tickets_Totales))
      .catch((err) => console.error("Erreur stats total tickets:", err));

    axios
      .get("http://localhost:8000/api/ticket/statParStatus/", { headers })
      .then((res) => setByStatus(res.data))
      .catch((err) => console.error("Erreur stats par statut:", err));

    axios
      .get("http://localhost:8000/api/ticket/statParUnite/", { headers })
      .then((res) => setByUnite(res.data))
      .catch((err) => console.error("Erreur stats par unité:", err));

    axios
      .get("http://localhost:8000/api/ticket/statParEquipement/", { headers })
      .then((res) => setByEquipement(res.data))
      .catch((err) => console.error("Erreur stats par équipement:", err));

    axios
      .get("http://localhost:8000/api/ticket/statParPriorite/", { headers })
      .then((res) => setByPriorite(res.data))
      .catch((err) => console.error("Erreur stats par priorité:", err));

    axios
      .get("http://localhost:8000/api/ticket/statParPersonne/", { headers })
      .then((res) => setByPersonne(res.data))
      .catch((err) => console.error("Erreur stats par utilisateur:", err));
  }, []);

  const renderPie = (data, labelField, colorFn) => (
    <MDBox height={220}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey={labelField}
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorFn(entry, index)} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </MDBox>
  );

  // Fonction pour fusionner 2 champs (code + nom)
  const mergeLabel = (data, codeField, nameField) =>
    data.map((item) => ({
      ...item,
      label: `${item[codeField]} - ${item[nameField]}`,
    }));

  // Fonction pour fusionner 3 champs (matricule + nom + prénom)
  const mergeLabelFullName = (data, codeField, nomField, prenomField) =>
    data.map((item) => ({
      ...item,
      label: `${item[codeField]} - ${item[nomField]} ${item[prenomField]}`,
    }));

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Statistiques des tickets
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
            color="error"
            icon="confirmation_number"
            title={`Tickets totaux : ${total}`}
            dateTime="Maintenant"
          />
        ) : (
          <MDTypography>Chargement...</MDTypography>
        )}
      </MDBox>

      {/* Par statut */}
      <MDBox p={2}>
        <MDTypography variant="subtitle2">Par statut :</MDTypography>
        {renderPie(byStatus, "etat", (entry) => {
          const key = entry.etat?.toLowerCase() || "autre";
          return STATUS_COLORS[key] || STATUS_COLORS["autre"];
        })}
      </MDBox>

      {/* Par unité */}
      <MDBox p={2}>
        <MDTypography variant="subtitle2">Par unité :</MDTypography>
        {renderPie(
          mergeLabel(byUnite, "unite__codePostal", "unite__nom"),
          "label",
          (_, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length]
        )}
      </MDBox>

      {/* Par équipement */}
      <MDBox p={2}>
        <MDTypography variant="subtitle2">Par équipement :</MDTypography>
        {renderPie(
          mergeLabel(byEquipement, "equipement__codeABarre", "equipement__nom"),
          "label",
          (_, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length]
        )}
      </MDBox>

      {/* Par priorité */}
      <MDBox p={2}>
        <MDTypography variant="subtitle2">Par priorité :</MDTypography>
        {renderPie(byPriorite, "priorite", (entry) => {
          const val = entry.priorite?.toLowerCase();
          return val === "haute" ? "#f44336" : val === "moyenne" ? "#ffeb3b" : "#4caf50";
        })}
      </MDBox>

      {/* Par utilisateur */}
      <MDBox p={2}>
        <MDTypography variant="subtitle2">Par utilisateur :</MDTypography>
        {renderPie(
          mergeLabelFullName(byPersonne, "matricule", "nom", "prenom"),
          "label",
          (_, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length]
        )}
      </MDBox>
    </Card>
  );
}

export default TicketsOverview;
