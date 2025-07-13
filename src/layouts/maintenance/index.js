// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import React, { useState } from "react";
import usemaintenancesTableData from "./data/maintenancetable";
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

function Tables() {
  const [open, setOpen] = useState(false);
  const [maintenancedetails, setmaintenancedetails] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const [addForm, setAddForm] = useState({
    unite: "",
    codeEquipement: "",
    ticket: "",
    diagnostique: "",
    datecréation: "",
    bureauSource: "",
    marque: "",
    typeMaintenance: "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    idMaintenance: null,
    unite: "",
    codeEquipement: "",
    ticket: "",
    diagnostique: "",
    datecréation: "",
    bureauSource: "",
    marque: "",
    typeMaintenance: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const handleVoir = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`http://localhost:8000/api/maintenance/detail/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setmaintenancedetails(response.data);
      setOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de la maintenance :", error);
    }
  };

  const isAdminUser = localStorage.getItem("isAdminUser") === "true";

  let { columns, rows } = usemaintenancesTableData(null, handleVoir);

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

  const openEditModal = (maintenance) => {
    // Format datetime-local input value (YYYY-MM-DDTHH:mm)
    let formattedDate = "";
    if (maintenance.datecréation) {
      formattedDate = maintenance.datecréation.slice(0, 16);
    }
    setEditForm({
      idMaintenance: maintenance.idMaintenance,
      unite: maintenance.unite || "",
      codeEquipement: maintenance.codeEquipement || "",
      ticket: maintenance.ticket || "",
      diagnostique: maintenance.diagnostique || "",
      datecréation: formattedDate,
      bureauSource: maintenance.bureauSource || "",
      marque: maintenance.marque || "",
      typeMaintenance: maintenance.typeMaintenance || "",
    });
    setEditError("");
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("access");

      const isoDate = editForm.datecréation ? new Date(editForm.datecréation).toISOString() : null;

      await axios.put(
        `http://localhost:8000/api/maintenance/edit/${editForm.idMaintenance}/`,
        {
          unite: parseInt(editForm.unite),
          codeEquipement: parseInt(editForm.codeEquipement),
          ticket: parseInt(editForm.ticket),
          diagnostique: editForm.diagnostique,
          datecréation: isoDate,
          bureauSource: editForm.bureauSource,
          marque: editForm.marque,
          typeMaintenance: editForm.typeMaintenance,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditOpen(false);
      window.location.reload();
    } catch (err) {
      setEditError("Erreur lors de la modification de la maintenance.");
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

      const isoDate = addForm.datecréation ? new Date(addForm.datecréation).toISOString() : null;

      await axios.post(
        "http://localhost:8000/api/maintenance/add/",
        {
          unite: parseInt(addForm.unite),
          codeEquipement: parseInt(addForm.codeEquipement),
          ticket: parseInt(addForm.ticket),
          diagnostique: addForm.diagnostique,
          datecréation: isoDate,
          bureauSource: addForm.bureauSource,
          marque: addForm.marque,
          typeMaintenance: addForm.typeMaintenance,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAddOpen(false);
      setAddForm({
        unite: "",
        codeEquipement: "",
        ticket: "",
        diagnostique: "",
        datecréation: "",
        bureauSource: "",
        marque: "",
        typeMaintenance: "",
      });
      window.location.reload();
    } catch (err) {
      setAddError("Erreur lors de la création de la maintenance.");
      console.error(err.response?.data || err.message);
    } finally {
      setAddLoading(false);
    }
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
                  Les Maintenances
                </MDTypography>
                <MDButton color="white" variant="contained" onClick={() => setAddOpen(true)}>
                  Créer une maintenance
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
                    }}
                  >
                    {maintenancedetails ? (
                      <>
                        <MDTypography variant="h6">Détails de la maintenance</MDTypography>
                        <MDTypography>ID: {maintenancedetails.idMaintenance}</MDTypography>
                        <MDTypography>Diagnostique: {maintenancedetails.diagnostique}</MDTypography>
                        <MDTypography>
                          Bureau Source: {maintenancedetails.bureauSource}
                        </MDTypography>
                        <MDTypography>
                          Date de création:{" "}
                          {new Date(maintenancedetails.datecréation).toLocaleString()}
                        </MDTypography>
                        <MDTypography>
                          Type de maintenance: {maintenancedetails.typeMaintenance}
                        </MDTypography>
                        <MDTypography>Marque: {maintenancedetails.marque}</MDTypography>
                        <MDTypography>Unité: {maintenancedetails.unite}</MDTypography>
                        <MDTypography>Équipement: {maintenancedetails.codeEquipement}</MDTypography>
                        <MDTypography>
                          Ticket correspondant: {maintenancedetails.ticket}
                        </MDTypography>
                      </>
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
                      minWidth: 350,
                    }}
                  >
                    <MDTypography variant="h6" mb={2}>
                      Ajouter une maintenance
                    </MDTypography>
                    <form onSubmit={handleAddSubmit}>
                      {[
                        { label: "Unité (ID)", key: "unite", type: "number" },
                        { label: "Équipement (ID)", key: "codeEquipement", type: "number" },
                        { label: "Ticket (ID)", key: "ticket", type: "number" },
                        { label: "Diagnostique", key: "diagnostique" },
                        { label: "Type de maintenance", key: "typeMaintenance" },
                        { label: "Marque", key: "marque" },
                        { label: "Bureau Source", key: "bureauSource" },
                        { label: "Date de création", key: "datecréation", type: "datetime-local" },
                      ].map((field) => (
                        <MDBox mb={2} key={field.key}>
                          <TextField
                            fullWidth
                            label={field.label}
                            type={field.type || "text"}
                            value={addForm[field.key]}
                            onChange={(e) =>
                              setAddForm({ ...addForm, [field.key]: e.target.value })
                            }
                            required
                            InputLabelProps={
                              field.type === "datetime-local" ? { shrink: true } : undefined
                            }
                          />
                        </MDBox>
                      ))}
                      {addError && (
                        <MDTypography color="error" mb={2}>
                          {addError}
                        </MDTypography>
                      )}
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

                {/* Modal Edition */}
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
                      minWidth: 400,
                    }}
                  >
                    <MDTypography variant="h6" mb={2}>
                      Modifier la maintenance
                    </MDTypography>
                    <form onSubmit={handleEditSubmit}>
                      {[
                        { label: "Unité (ID)", key: "unite", type: "number" },
                        { label: "Équipement (ID)", key: "codeEquipement", type: "number" },
                        { label: "Ticket (ID)", key: "ticket", type: "number" },
                        { label: "Diagnostique", key: "diagnostique" },
                        { label: "Type de maintenance", key: "typeMaintenance" },
                        { label: "Marque", key: "marque" },
                        { label: "Bureau Source", key: "bureauSource" },
                        { label: "Date de création", key: "datecréation", type: "datetime-local" },
                      ].map((field) => (
                        <MDBox mb={2} key={field.key}>
                          <TextField
                            fullWidth
                            label={field.label}
                            type={field.type || "text"}
                            value={editForm[field.key]}
                            onChange={(e) =>
                              setEditForm({ ...editForm, [field.key]: e.target.value })
                            }
                            required
                            InputLabelProps={
                              field.type === "datetime-local" ? { shrink: true } : undefined
                            }
                          />
                        </MDBox>
                      ))}
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
