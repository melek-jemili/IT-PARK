import { useEffect, useState } from "react";
import axios from "axios";

// @mui components
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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

  // ---- États pour le menu export ----
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
  // ---- Export PDF ----
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Rapport des Maintenances", 14, 15);
    doc.setFontSize(12);
    doc.text(`Total des maintenances : ${total}`, 14, 25);

    let startY = 35;

    if (byUnite && byUnite.length > 0) {
      autoTable(doc, {
        startY,
        head: [["Unité", ...byUnite.map((u) => `${u.unite__codePostal} - ${u.unite__nom}`)]],
        body: [["Nombre", ...byUnite.map((u) => u.total)]],
        theme: "grid",
        headStyles: { fillColor: [155, 89, 182] },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    if (byStatut && byStatut.length > 0) {
      const head = [["Statut", ...byStatut.map((s) => s.etat)]];
      const body = [["Nombre", ...byStatut.map((s) => s.total)]];
      autoTable(doc, {
        startY,
        head,
        body,
        theme: "grid",
        headStyles: { fillColor: [39, 174, 96] },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    const date = new Date().toLocaleString("fr-FR");
    doc.setFontSize(10);
    doc.text(`Généré le : ${date}`, 14, 290);
    doc.save("Equipements_report.pdf");
    handleClose();
  };

  // ---- Export Excel ----
  const exportExcel = () => {
    const ws_data = [];

    // Ligne total
    ws_data.push(["Total Equipements", total]);
    ws_data.push([]);

    // Par unité
    if (byUnite.length > 0) {
      ws_data.push([
        "Par Unité",
        ...byUnite.map((u) => `${u.unite__codePostal} - ${u.unite__nom}`),
      ]);
      ws_data.push(["Nombre", ...byUnite.map((u) => u.total)]);
      ws_data.push([]);
    }

    // Par statut
    if (byEquipement.length > 0) {
      ws_data.push(["Par Statut", ...byStatut.map((e) => `${e.etat}`)]);
      ws_data.push(["Nombre", ...byStatut.map((e) => e.total)]);
      ws_data.push([]);
    }

    // Pied de page
    ws_data.push([`Généré le : ${new Date().toLocaleString("fr-FR")}`]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rapport Maintenances");
    XLSX.writeFile(wb, "maintenances_report.xlsx");
    handleClose();
  };

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
      {/* ---- Bouton Export ---- */}
      <MDBox mt={1} mb={2}>
        <Button variant="contained" color="primary" onClick={handleExportClick}>
          Exporter
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={exportPDF}>PDF</MenuItem>
          <MenuItem onClick={exportExcel}>Excel</MenuItem>
        </Menu>
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
