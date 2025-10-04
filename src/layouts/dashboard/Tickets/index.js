import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Pour export
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

  // état pour le menu export
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fonction export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Tickets Totaux": total },
      ...byStatus.map((s) => ({ Statut: s.etat, Total: s.total })),
      ...byUnite.map((u) => ({ Unité: u.unite__nom, Total: u.total })),
      ...byEquipement.map((e) => ({
        Equipement: e.equipement__nom,
        Total: e.total,
      })),
      ...byPriorite.map((p) => ({ Priorité: p.priorite, Total: p.total })),
      ...byPersonne.map((p) => ({
        Utilisateur: `${p.nom} ${p.prenom}`,
        Total: p.total,
      })),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stats Tickets");
    XLSX.writeFile(wb, "tickets_stats.xlsx");
    handleClose();
  };

  // Fonction export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // ---- Titre ----
    doc.setFontSize(18);
    doc.text("Rapport des Tickets", 14, 15);

    // ---- Total tickets ----
    doc.setFontSize(12);
    doc.text(`Total des tickets : ${total}`, 14, 25);

    let startY = 35;

    // ---- Tableau Priorité ----
    if (byPriorite && byPriorite.length > 0) {
      const head = [["Priorité", ...byPriorite.map((p) => p.priorite)]];
      const body = [["Nombre", ...byPriorite.map((p) => p.total)]];
      autoTable(doc, {
        startY,
        head,
        body,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // ---- Tableau Statut ----
    if (byStatus && byStatus.length > 0) {
      const head = [["Statut", ...byStatus.map((s) => s.etat)]];
      const body = [["Nombre", ...byStatus.map((s) => s.total)]];
      autoTable(doc, {
        startY,
        head,
        body,
        theme: "grid",
        headStyles: { fillColor: [39, 174, 96] },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // ---- Tableau Unité ----
    if (byUnite && byUnite.length > 0) {
      const head = [["Unité", ...byUnite.map((u) => `${u.unite__codePostal} - ${u.unite__nom}`)]];
      const body = [["Nombre", ...byUnite.map((u) => u.total)]];
      autoTable(doc, {
        startY,
        head,
        body,
        theme: "grid",
        headStyles: { fillColor: [155, 89, 182] },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // ---- Tableau Équipement ----
    if (byEquipement && byEquipement.length > 0) {
      const head = [
        [
          "Équipement",
          ...byEquipement.map((e) => `${e.equipement__codeABarre} - ${e.equipement__nom}`),
        ],
      ];
      const body = [["Nombre", ...byEquipement.map((e) => e.total)]];
      autoTable(doc, {
        startY,
        head,
        body,
        theme: "grid",
        headStyles: { fillColor: [231, 76, 60] },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // ---- Tableau Utilisateur ----
    if (byPersonne && byPersonne.length > 0) {
      const head = [
        ["Utilisateur", ...byPersonne.map((p) => `${p.matricule} - ${p.nom} ${p.prenom}`)],
      ];
      const body = [["Nombre", ...byPersonne.map((p) => p.total)]];
      autoTable(doc, {
        startY,
        head,
        body,
        theme: "grid",
        headStyles: { fillColor: [243, 156, 18] },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // ---- Pied de page : date ----
    const date = new Date().toLocaleString("fr-FR");
    doc.setFontSize(10);
    doc.text(`Généré le : ${date}`, 14, 290);

    // ---- Sauvegarde ----
    doc.save("tickets_report.pdf");
  };

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

  const mergeLabel = (data, codeField, nameField) =>
    data.map((item) => ({
      ...item,
      label: `${item[codeField]} - ${item[nameField]}`,
    }));

  const mergeLabelFullName = (data, codeField, nomField, prenomField) =>
    data.map((item) => ({
      ...item,
      label: `${item[codeField]} - ${item[nomField]} ${item[prenomField]}`,
    }));

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3} display="flex" justifyContent="space-between">
        <MDTypography variant="h6" fontWeight="medium">
          Statistiques des tickets
        </MDTypography>

        {/* Bouton Export */}
        <div>
          <Button variant="contained" color="primary" onClick={handleExportClick}>
            Exporter
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={exportPDF}>PDF</MenuItem>
            <MenuItem onClick={exportExcel}>Excel</MenuItem>
          </Menu>
        </div>
      </MDBox>

      <MDBox mt={0} mb={2} px={3}>
        <MDTypography variant="button" color="text" fontWeight="regular">
          Données en temps réel
        </MDTypography>
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

      {/* Les graphiques inchangés */}
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
          return val === "high"
            ? "#f44336"
            : val === "moyenne"
            ? "#ffeb3b"
            : val === "faible"
            ? "#4caf50"
            : "#9e9e9e";
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
