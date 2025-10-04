import { useEffect, useState } from "react";
import axios from "axios";

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

// Fonction pour fusionner 2 champs en label : "code - nom"
const mergeLabel = (data, codeField, nameField) =>
  data.map((item) => ({
    ...item,
    label: `${item[codeField]} - ${item[nameField]}`,
  }));

function MaintenancesOverview() {
  const [total, setTotal] = useState(null);
  const [byUnite, setByUnite] = useState([]);
  const [byEquipement, setByEquipement] = useState([]);

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
      .get("http://localhost:8000/api/maintenance/stats/", { headers })
      .then((res) => setTotal(res.data.Maintenances_Totales))
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

    if (byEquipement && byEquipement.length > 0) {
      autoTable(doc, {
        startY,
        head: [
          [
            "Équipement",
            ...byEquipement.map(
              (e) => `${e.codeEquipement__codeABarre} - ${e.codeEquipement__nom}`
            ),
          ],
        ],
        body: [["Nombre", ...byEquipement.map((e) => e.total)]],
        theme: "grid",
        headStyles: { fillColor: [231, 76, 60] },
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    const date = new Date().toLocaleString("fr-FR");
    doc.setFontSize(10);
    doc.text(`Généré le : ${date}`, 14, 290);
    doc.save("maintenances_report.pdf");
    handleClose();
  };

  // ---- Export Excel ----
  const exportExcel = () => {
    const ws_data = [];

    // Ligne total
    ws_data.push(["Total Maintenances", total]);
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

    // Par équipement
    if (byEquipement.length > 0) {
      ws_data.push([
        "Par Équipement",
        ...byEquipement.map((e) => `${e.codeEquipement__codeABarre} - ${e.codeEquipement__nom}`),
      ]);
      ws_data.push(["Nombre", ...byEquipement.map((e) => e.total)]);
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
          renderPie(mergeLabel(byUnite, "unite__codePostal", "unite__nom"), "label")
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
          renderPie(
            mergeLabel(byEquipement, "codeEquipement__nom", "codeEquipement__codeABarre"),
            "label"
          )
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
