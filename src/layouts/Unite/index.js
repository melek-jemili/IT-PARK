// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import React, { useState } from "react";
import useUniteTableData from "./data/uniteDataTable";
import axios from "axios";

function EditButtonCell({ row, openEditModal }) {
  return (
    <MDButton
      variant="outlined"
      color="info"
      size="small"
      onClick={() => openEditModal(row.original)}
    >
      Modifier
    </MDButton>
  );
}

EditButtonCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.object.isRequired,
  }).isRequired,
  openEditModal: PropTypes.func.isRequired,
};

const nomOptions = ["agence", "bureau", "direction régionale", "centre de distribution"];
const classeOptions = ["A1", "A2", "B1", "B2", "C"];

function Tables() {
  const [open, setOpen] = useState(false);
  const [uniteDetails, setUniteDetails] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [addForm, setAddForm] = useState({
    codePostal: "",
    nom: "",
    classe: "",
    gouvernorat: "",
    adresse: "",
    nombreEmployes: "",
    nombreGuichets: "",
    chefUnité: "",
    plageIP: "",
    typeLiason1: "",
    typeLiason2: "",
    idLiaison1: "",
    idLiaison2: "",
  });

  const [editForm, setEditForm] = useState({ ...addForm });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const handleVoir = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(`http://localhost:8000/api/unite/detail/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUniteDetails(res.data);
      setOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'unité:", error);
    }
  };

  const isAdminUser = localStorage.getItem("isAdminUser") === "true";
  let { columns, rows } = useUniteTableData(null, handleVoir);

  if (isAdminUser) {
    columns = [
      ...columns,
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: (props) => <EditButtonCell {...props} openEditModal={openEditModal} />,
      },
    ];
  }

  const openEditModal = (unite) => {
    setEditForm({
      codePostal: unite.codePostal,
      nom: unite.nom,
      classe: unite.classe,
      gouvernorat: unite.gouvernorat,
      adresse: unite.adresse,
      nombreEmployes: unite.nombreEmployes,
      nombreGuichets: unite.nombreGuichets,
      chefUnité: unite.chefUnité,
      plageIP: unite.plageIP,
      typeLiason1: unite.typeLiason1,
      typeLiason2: unite.typeLiason2,
      idLiaison1: unite.idLiaison1,
      idLiaison2: unite.idLiaison2,
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("access");

      const payload = {
        codePostal: parseInt(editForm.codePostal, 10),
        nom: editForm.nom,
        classe: editForm.classe,
        gouvernorat: editForm.gouvernorat,
        adresse: editForm.adresse,
        nombreEmployes: parseInt(editForm.nombreEmployes, 10),
        nombreGuichets: parseInt(editForm.nombreGuichets, 10),
        chefUnité: editForm.chefUnité,
        plageIP: editForm.plageIP,
        typeLiason1: editForm.typeLiason1,
        typeLiason2: editForm.typeLiason2,
        idLiaison1: parseInt(editForm.idLiaison1, 10),
        idLiaison2: parseInt(editForm.idLiaison2, 10),
      };

      await axios.put(`http://localhost:8000/api/unite/edit/${editForm.codePostal}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditOpen(false);
      window.location.reload();
    } catch (err) {
      setEditError("Erreur lors de la modification de l'unité.");
      console.error(err.response?.data || err.message);
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

      const payload = {
        codePostal: parseInt(addForm.codePostal, 10),
        nom: addForm.nom,
        classe: addForm.classe,
        gouvernorat: addForm.gouvernorat,
        adresse: addForm.adresse,
        nombreEmployes: parseInt(addForm.nombreEmployes, 10),
        nombreGuichets: parseInt(addForm.nombreGuichets, 10),
        chefUnité: addForm.chefUnité,
        plageIP: addForm.plageIP,
        typeLiason1: addForm.typeLiason1,
        typeLiason2: addForm.typeLiason2,
        idLiaison1: parseInt(addForm.idLiaison1, 10),
        idLiaison2: parseInt(addForm.idLiaison2, 10),
      };

      await axios.post("http://localhost:8000/api/unite/add/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddOpen(false);
      window.location.reload();
    } catch (err) {
      setAddError("Erreur lors de l'ajout de l'unité.");
      console.error(err.response?.data || err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const fields = [
    { label: "Code Postal", key: "codePostal", type: "number" },
    { label: "Nom", key: "nom" },
    { label: "Classe", key: "classe" },
    { label: "Gouvernorat", key: "gouvernorat" },
    { label: "Adresse", key: "adresse" },
    { label: "Nombre Employes", key: "nombreEmployes", type: "number" },
    { label: "Nombre Guichets", key: "nombreGuichets", type: "number" },
    { label: "Chef Unité", key: "chefUnite" },
    { label: "Plage IP", key: "plageIP" },
    { label: "Type Liaison 1", key: "typeLiaison1" },
    { label: "Type Liaison 2", key: "typeLiaison2" },
    { label: "ID Liaison 1", key: "idLiaison1", type: "number" },
    { label: "ID Liaison 2", key: "idLiaison2", type: "number" },
  ];

  const renderFormFields = (form, setForm) =>
    fields.map((field) => {
      if (field.key === "nom") {
        return (
          <MDBox mb={2} key={field.key}>
            <FormControl fullWidth required>
              <InputLabel>Nom</InputLabel>
              <Select
                value={form.nom}
                label="Nom"
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              >
                {nomOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MDBox>
        );
      }
      if (field.key === "classe") {
        return (
          <MDBox mb={2} key={field.key}>
            <FormControl fullWidth required>
              <InputLabel>Classe</InputLabel>
              <Select
                value={form.classe}
                label="Classe"
                onChange={(e) => setForm({ ...form, classe: e.target.value })}
              >
                {classeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MDBox>
        );
      }
      return (
        <MDBox mb={2} key={field.key}>
          <TextField
            fullWidth
            label={field.label}
            type={field.type || "text"}
            value={form[field.key]}
            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            required
          />
        </MDBox>
      );
    });

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
                  Unités
                </MDTypography>
                <MDButton color="white" onClick={() => setAddOpen(true)}>
                  Ajouter une unité
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

                {/* Modal Voir */}
                <Modal open={open} onClose={() => setOpen(false)}>
                  <MDBox
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      p: 4,
                      minWidth: 300,
                      borderRadius: 2,
                    }}
                  >
                    {uniteDetails ? (
                      Object.entries(uniteDetails).map(([key, value]) => (
                        <MDTypography key={key}>{`${key} : ${value}`}</MDTypography>
                      ))
                    ) : (
                      <MDTypography>Chargement...</MDTypography>
                    )}
                  </MDBox>
                </Modal>

                {/* Modal Ajout */}
                <Modal open={addOpen} onClose={() => setAddOpen(false)}>
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
                      maxHeight: "80vh",
                      overflowY: "auto",
                      borderRadius: 2,
                    }}
                  >
                    <MDTypography variant="h6" mb={2}>
                      Ajouter une unité
                    </MDTypography>
                    <form onSubmit={handleAddSubmit}>
                      {renderFormFields(addForm, setAddForm)}
                      {addError && <MDTypography color="error">{addError}</MDTypography>}
                      <MDBox display="flex" justifyContent="flex-end">
                        <MDButton
                          type="submit"
                          color="info"
                          variant="gradient"
                          disabled={addLoading}
                        >
                          {addLoading ? "Ajout..." : "Enregistrer"}
                        </MDButton>
                      </MDBox>
                    </form>
                  </MDBox>
                </Modal>

                {/* Modal Édition */}
                <Modal open={editOpen} onClose={() => setEditOpen(false)}>
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
                      maxHeight: "80vh",
                      overflowY: "auto",
                      borderRadius: 2,
                    }}
                  >
                    <MDTypography variant="h6" mb={2}>
                      Modifier
                    </MDTypography>
                    <form onSubmit={handleEditSubmit}>
                      {renderFormFields(editForm, setEditForm)}
                      {editError && <MDTypography color="error">{editError}</MDTypography>}
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
                    </form>
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
