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

// Hooks & data
import React, { useState } from "react";
import useEquipementsTableData from "./data/equipementDataTable";
import axios from "axios";

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
                          <MDTypography key={key}>{`${key}: ${value}`}</MDTypography>
                        ))}
                        {isAdminUser && (
                          <MDButton
                            onClick={() => openEditModal(equipementDetails)}
                            color="info"
                            variant="outlined"
                            sx={{ mt: 2 }}
                          >
                            Modifier
                          </MDButton>
                        )}
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
