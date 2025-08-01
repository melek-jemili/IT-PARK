import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useProfileTableData from "./data/listeTableData";

export default function ProfilesList() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [notFoundMessage, setNotFoundMessage] = useState("");

  const open = Boolean(anchorEl);

  const handleChangePasswordClick = (matricule) => {
    setSelectedUser(matricule);
    setModalPasswordOpen(true);
    setStatusMessage("");
    setNewPassword("");
  };

  const tableData = useProfileTableData(searchResults, handleChangePasswordClick);

  const handleClose = () => setAnchorEl(null);
  const handleExportClick = (e) => setAnchorEl(e.currentTarget);

  const handlePasswordSubmit = async () => {
    if (!newPassword || !selectedUser) {
      setStatusMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const token = localStorage.getItem("access");
      await axios.post(
        "http://localhost:8000/api/Users/admin_change_password/",
        {
          matricule: selectedUser,
          new_password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatusMessage("Mot de passe changé avec succès.");
    } catch (error) {
      console.error(error);
      setStatusMessage("Erreur lors du changement du mot de passe.");
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults(null);
      setNotFoundMessage("");
      return;
    }

    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`http://localhost:8000/api/Users/search/?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.matricule) {
        setSearchResults([response.data]); // On enveloppe l’objet dans un tableau
        setNotFoundMessage("");
      } else if (response.data.message) {
        setSearchResults([]);
        setNotFoundMessage(response.data.message);
      }
    } catch (error) {
      setSearchResults([]);
      setNotFoundMessage("Erreur lors de la recherche.");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont("times");
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("L'office National des Postes", pageWidth / 2, 25, { align: "center" });
    doc.text("Direction Régionale - Bizerte", pageWidth / 2, 35, { align: "center" });

    const getText = (cell) =>
      typeof cell === "object" && cell?.props?.children ? cell.props.children : cell || "N/A";

    const rows = tableData.rows.map((row) => [
      getText(row.matricule),
      getText(row.nom),
      getText(row.prenom),
      getText(row.cin),
      getText(row.email),
      getText(row.telephone),
      getText(row.unite),
      getText(row.fonction),
      getText(row.dateNaissance),
      getText(row.region),
    ]);

    autoTable(doc, {
      startY: 50,
      head: [
        [
          "Matricule",
          "Nom",
          "Prénom",
          "CIN",
          "Email",
          "Téléphone",
          "Unité",
          "Fonction",
          "Naissance",
          "Région",
        ],
      ],
      body: rows,
      styles: { font: "times", fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      margin: { left: 10, right: 10 },
      didDrawPage: () => {
        const date = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.text(`Généré le : ${date}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      },
    });

    doc.save("liste_utilisateurs.pdf");
    handleClose();
  };

  const exportToExcel = () => {
    const getText = (cell) =>
      typeof cell === "object" && cell?.props?.children ? cell.props.children : cell || "N/A";

    const data = tableData.rows.map((row) => ({
      Matricule: getText(row.matricule),
      Nom: getText(row.nom),
      Prenom: getText(row.prenom),
      CIN: getText(row.cin),
      Email: getText(row.email),
      Téléphone: getText(row.telephone),
      Unité: getText(row.unite),
      Fonction: getText(row.fonction),
      "Date de naissance": getText(row.dateNaissance),
      Région: getText(row.region),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Utilisateurs");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "liste_utilisateurs.xlsx");
    handleClose();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDTypography variant="h4">Liste des utilisateurs</MDTypography>
          <TextField
            label="Rechercher par matricule"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            variant="outlined"
            size="small"
            style={{ width: "300px" }}
          />
        </MDBox>

        {notFoundMessage && (
          <MDTypography color="error" mb={2}>
            {notFoundMessage}
          </MDTypography>
        )}

        <Button variant="contained" color="primary" onClick={handleExportClick}>
          Exporter
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={exportToPDF}>Exporter en PDF</MenuItem>
          <MenuItem onClick={exportToExcel}>Exporter en Excel</MenuItem>
        </Menu>

        <DataTable
          table={{ columns: tableData.columns, rows: tableData.rows }}
          isSorted={false}
          entriesPerPage
          showTotalEntries
          noEndBorder
        />

        <Modal open={modalPasswordOpen} onClose={() => setModalPasswordOpen(false)}>
          <MDBox
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              width: 400,
              borderRadius: 2,
            }}
          >
            <MDTypography variant="h6" mb={2}>
              Changement mot de passe (Matricule: {selectedUser})
            </MDTypography>

            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
            />

            {statusMessage && (
              <MDTypography color={statusMessage.includes("succès") ? "success" : "error"}>
                {statusMessage}
              </MDTypography>
            )}

            <Button variant="contained" color="primary" fullWidth onClick={handlePasswordSubmit}>
              Enregistrer
            </Button>
          </MDBox>
        </Modal>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
