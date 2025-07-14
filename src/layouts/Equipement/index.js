import React, { useState } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout & Tables
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Hook for table data
import useEquipementsTableData from "./data/equipementDataTable";

// PDF libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Remplace ici par ton logo base64 (PNG de préférence)
const logoBase64 =
  "data:image/png;base64,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";

function Tables() {
  const [open, setOpen] = useState(false);
  const [equipementDetails, setEquipementDetails] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    codeABarre: "",
    nom: "",
    numeroSerie: "",
    modele: "",
    marque: "",
    type: "",
    etat: "",
    dateMiseEnService: "",
    adresseIP: "",
    adresseMAC: "",
    unite: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    codeABarre: "",
    nom: "",
    numeroSerie: "",
    modele: "",
    marque: "",
    type: "",
    etat: "",
    dateMiseEnService: "",
    adresseIP: "",
    adresseMAC: "",
    unite: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const etatOptions = [
    { value: "fonctionnel", label: "Fonctionnel" },
    { value: "en panne", label: "En panne" },
    { value: "hors-service", label: "Hors-service" },
  ];

  const user = localStorage.getItem("personnel");
  const isAdminUser = localStorage.getItem("isAdminUser") === "true";

  const formModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    width: "90%",
    maxWidth: 400,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.875rem",
  };

  const handleVoir = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`http://localhost:8000/api/equipements/detail/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipementDetails(response.data);
      setOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'équipement :", error);
    }
  };
  const { columns, rows } = useEquipementsTableData(user, handleVoir);

  const openEditModal = (equipement) => {
    setEditForm({ ...equipement });
    setEditError("");
    setEditOpen(true);
    setOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("access");
      await axios.put(
        `http://localhost:8000/api/equipements/edit/${editForm.codeABarre}/`,
        {
          ...editForm,
          codeABarre: parseInt(editForm.codeABarre),
          numeroSerie: parseInt(editForm.numeroSerie),
          unite: parseInt(editForm.unite),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditOpen(false);
      window.location.reload();
    } catch (err) {
      setEditError("Erreur lors de la modification de l'équipement.");
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const token = localStorage.getItem("access");
      await axios.post(
        "http://localhost:8000/api/equipements/add/",
        {
          ...addForm,
          codeABarre: parseInt(addForm.codeABarre),
          numeroSerie: parseInt(addForm.numeroSerie),
          unite: parseInt(addForm.unite),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddOpen(false);
      setAddForm({
        codeABarre: "",
        nom: "",
        numeroSerie: "",
        modele: "",
        marque: "",
        type: "",
        etat: "",
        dateMiseEnService: "",
        adresseIP: "",
        adresseMAC: "",
        unite: "",
      });
      window.location.reload();
    } catch (err) {
      setAddError("Erreur lors de la création de l'équipement.");
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  };

  const renderFields = (form, setForm, mode = "add") => (
    <>
      {[
        "codeABarre",
        "nom",
        "numeroSerie",
        "modele",
        "marque",
        "type",
        "dateMiseEnService",
        "adresseIP",
        "adresseMAC",
        "unite",
      ].map((key) => (
        <MDBox mb={2} key={key}>
          <MDTypography>{key}</MDTypography>
          <input
            type={
              key === "dateMiseEnService"
                ? "date"
                : key === "numeroSerie" || key === "codeABarre" || key === "unite"
                ? "number"
                : "text"
            }
            value={form[key]}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            required
            style={inputStyle}
          />
        </MDBox>
      ))}

      <MDBox mb={2}>
        <MDTypography>État</MDTypography>
        <TextField
          select
          fullWidth
          value={form.etat}
          onChange={(e) => setForm((prev) => ({ ...prev, etat: e.target.value }))}
          required
        >
          {etatOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </MDBox>
    </>
  );

  // Fonction pour générer le PDF stylé
  const handlePrintPdf = () => {
    if (!equipementDetails) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont("times");

    // Logo en haut à droite (40x40)
    const marginRight = 15;
    doc.addImage(logoBase64, "PNG", pageWidth - 40 - marginRight, 10, 40, 40);

    // Titre centré, en gras, taille 18
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("L'office National des Postes", pageWidth / 2, 25, { align: "center" });
    doc.text("Direction Régionale - Bizerte", pageWidth / 2, 35, { align: "center" });

    // Préparer les données pour le tableau
    const rows = Object.entries(equipementDetails).map(([key, value]) => [
      key.charAt(0).toUpperCase() +
        key
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " "),
      value?.toString() || "",
    ]);

    // Générer le tableau avec autotable
    autoTable(doc, {
      startY: 50,
      head: [["Champ", "Valeur"]],
      body: rows,
      styles: {
        font: "times",
        fontSize: 12,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 110 },
      },
      tableLineWidth: 0.1,
      tableLineColor: 50,
      didDrawPage: (data) => {
        // Date en bas, centrée
        const date = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Date de génération : ${date}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      },
    });

    doc.save(`fiche_equipement_${equipementDetails.codeABarre || "detail"}.pdf`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  Les Équipements
                </MDTypography>
                <MDButton color="white" variant="contained" onClick={() => setAddOpen(true)}>
                  Ajouter un équipement
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />

                {/* Modal Détails */}
                <Modal open={open} onClose={() => setOpen(false)}>
                  <MDBox sx={formModalStyle}>
                    {equipementDetails ? (
                      <>
                        <MDTypography variant="h6" mb={2}>
                          Détails équipement
                        </MDTypography>
                        {Object.entries(equipementDetails).map(([key, value]) => (
                          <MDTypography key={key}>
                            {`${
                              key.charAt(0).toUpperCase() +
                              key
                                .slice(1)
                                .replace(/([A-Z])/g, " $1")
                                .replace(/_/g, " ")
                            } : ${value || ""}`}
                          </MDTypography>
                        ))}

                        <MDBox display="flex" gap={2} mt={2}>
                          <MDButton onClick={handlePrintPdf} color="secondary" variant="outlined">
                            Imprimer fiche
                          </MDButton>

                          {isAdminUser && (
                            <MDButton
                              onClick={() => openEditModal(equipementDetails)}
                              color="info"
                              variant="outlined"
                            >
                              Modifier
                            </MDButton>
                          )}
                        </MDBox>
                      </>
                    ) : (
                      <MDTypography>Chargement...</MDTypography>
                    )}
                  </MDBox>
                </Modal>

                {/* Modal Ajout */}
                <Modal open={addOpen} onClose={() => setAddOpen(false)}>
                  <MDBox component="form" onSubmit={handleAddSubmit} sx={formModalStyle}>
                    <MDTypography variant="h6" mb={2}>
                      Ajouter un équipement
                    </MDTypography>
                    {renderFields(addForm, setAddForm)}
                    {addError && (
                      <MDTypography color="error" mb={2}>
                        {addError}
                      </MDTypography>
                    )}
                    <MDBox display="flex" justifyContent="flex-end">
                      <MDButton type="submit" color="info" variant="gradient" disabled={addLoading}>
                        {addLoading ? "Ajout..." : "Enregistrer"}
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </Modal>

                {/* Modal Modification */}
                <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                  <MDBox component="form" onSubmit={handleEditSubmit} sx={formModalStyle}>
                    <MDTypography variant="h6" mb={2}>
                      Modifier un équipement
                    </MDTypography>
                    {renderFields(editForm, setEditForm, "edit")}
                    {editError && (
                      <MDTypography color="error" mb={2}>
                        {editError}
                      </MDTypography>
                    )}
                    <MDBox display="flex" justifyContent="flex-end">
                      <MDButton
                        type="submit"
                        color="info"
                        variant="gradient"
                        disabled={editLoading}
                      >
                        {editLoading ? "Modification..." : "Enregistrer"}
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </Modal>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
