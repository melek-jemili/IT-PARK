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
import useTicketsTableData from "./data/authorsTableData";
import useMaintenanceTableData from "layouts/tables/data/projectsTableData";
import useAllTicketsTableData from "./data/allTicketsTableData";
import axios from "axios";

function Tables() {
  const [open, setOpen] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [maintenanceDetails, setMaintenanceDetails] = useState(null);

  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const [addForm, setAddForm] = useState({
    unite: "",
    equipement: "",
    personnel: "",
    description: "",
    dateCreation: "",
    priorite: "",
    etat: "fermé",
    dateResolution: "0000-00-00T00:00",
  });

  // --- AJOUT pour édition de l'état (admin seulement) ---
  const etatOptions = [
    { value: "fermé", label: "Fermé" },
    { value: "ouvert", label: "Ouvert" },
    { value: "encours", label: "En cours" },
  ];

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ idTicket: null, etat: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const handleEditOpen = (ticket) => {
    setEditForm({ idTicket: ticket.idTicket, etat: ticket.etat });
    setEditError("");
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("access");
      await axios.put(
        `http://localhost:8000/api/ticket/edit/${editForm.idTicket}/`,
        { etat: editForm.etat },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditOpen(false);
      // Recharge les tickets ou la page, selon ton besoin
      window.location.reload();
    } catch (error) {
      setEditError("Erreur lors de la modification du ticket.");
    } finally {
      setEditLoading(false);
    }
  };
  // --- FIN Ajout édition état ---

  const handleVoir = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`http://localhost:8000/api/ticket/detail/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTicketDetails(response.data);
      setOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération du ticket :", error);
    }
  };

  const handleVoirMaintenance = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`http://localhost:8000/api/maintenance/detail/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaintenanceDetails(response.data);
      setMaintenanceOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de la maintenance :", error);
    }
  };

  const user = localStorage.getItem("personnel");
  const isAdminUser = localStorage.getItem("isAdminUser") === "true";

  const { columns, rows } = useTicketsTableData(user, handleVoir);
  const { columns: allColumns, rows: allRows } = useAllTicketsTableData(user, handleVoir);
  const { columns: pColumns, rows: pRows } = useMaintenanceTableData(user, handleVoirMaintenance);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Tickets */}
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
                  Les Tickets
                </MDTypography>
                <MDButton color="white" variant="contained" onClick={() => setAddOpen(true)}>
                  Ajouter un ticket
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
              </MDBox>
            </Card>
          </Grid>

          {/* Tous les Tickets (admin only) */}
          {isAdminUser && (
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
                >
                  <MDTypography variant="h6" color="white">
                    Tous les Tickets
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: allColumns, rows: allRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          )}

          {/* Maintenances (non-admin only) */}
          {!isAdminUser && (
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
                >
                  <MDTypography variant="h6" color="white">
                    Les Maintenances
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: pColumns, rows: pRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>

      {/* Modal Voir Ticket */}
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
          {ticketDetails ? (
            <>
              <MDTypography variant="h6">Détails du ticket</MDTypography>
              <MDTypography>ID: {ticketDetails.idTicket}</MDTypography>
              <MDTypography>Description: {ticketDetails.description}</MDTypography>
              <MDTypography>Statut: {ticketDetails.etat}</MDTypography>
              <MDTypography>Date de création: {ticketDetails.dateCreation}</MDTypography>
              <MDTypography>Date résolution estimée: {ticketDetails.dateResolution}</MDTypography>
              <MDTypography>Priorité: {ticketDetails.priorite}</MDTypography>
              <MDTypography>Unité: {ticketDetails.unite}</MDTypography>
              <MDTypography>Équipement: {ticketDetails.equipement}</MDTypography>
              <MDTypography>Personnel: {ticketDetails.personnel}</MDTypography>

              {/* Bouton Modifier l'état visible uniquement aux admins */}
              {isAdminUser && (
                <MDButton
                  onClick={() => {
                    setOpen(false);
                    handleEditOpen(ticketDetails);
                  }}
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

      {/* Modal Ajouter Ticket */}
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
            minWidth: 400,
          }}
        >
          <MDTypography variant="h6" mb={2}>
            Ajouter un ticket
          </MDTypography>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setAddLoading(true);
              setAddError("");
              try {
                const token = localStorage.getItem("access");
                await axios.post("http://localhost:8000/api/ticket/add/", addForm, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setAddOpen(false);
                setAddForm({
                  unite: "",
                  equipement: "",
                  personnel: "",
                  description: "",
                  dateCreation: "0000-00-00T00:00",
                  priorite: "",
                  etat: "ferme",
                  dateResolution: "0000-00-00T00:00",
                });
                window.location.reload();
              } catch (err) {
                setAddError("Erreur lors de l'ajout du ticket.");
              } finally {
                setAddLoading(false);
              }
            }}
          >
            {[
              { label: "Unité", key: "unite" },
              { label: "Équipement", key: "equipement" },
              { label: "Personnel", key: "personnel" },
              { label: "Description", key: "description" },
              { label: "Date de création", key: "dateCreation", type: "datetime-local" },
              { label: "Priorité", key: "priorite" },
              // Champ état bloqué si non admin
              {
                label: "Statut",
                key: "etat",
                select: true,
                disabled: !isAdminUser,
                options: etatOptions,
              },
              {
                label: "Date de résolution (estimation)",
                key: "dateResolution",
                type: "datetime-local",
              },
            ].map((field) =>
              field.select ? (
                <MDBox mb={2} key={field.key}>
                  <TextField
                    select
                    fullWidth
                    label={field.label}
                    value={addForm[field.key]}
                    onChange={(e) => setAddForm({ ...addForm, [field.key]: e.target.value })}
                    required
                    disabled={field.disabled}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </MDBox>
              ) : (
                <MDBox mb={2} key={field.key}>
                  <TextField
                    fullWidth
                    label={field.label}
                    type={field.type || "text"}
                    value={addForm[field.key]}
                    onChange={(e) => setAddForm({ ...addForm, [field.key]: e.target.value })}
                    required
                  />
                </MDBox>
              )
            )}
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
          </form>
        </MDBox>
      </Modal>

      {/* Modal Voir Maintenance */}
      <Modal open={maintenanceOpen} onClose={() => setMaintenanceOpen(false)}>
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
          {maintenanceDetails ? (
            <>
              <MDTypography variant="h6">Détails de la maintenance</MDTypography>
              <MDTypography>ID: {maintenanceDetails.idMaintenance}</MDTypography>
              <MDTypography>Diagnostique: {maintenanceDetails.diagnostique}</MDTypography>
              <MDTypography>Bureau Source: {maintenanceDetails.bureauSource}</MDTypography>
              <MDTypography>Date de création: {maintenanceDetails.datecréation}</MDTypography>
              <MDTypography>Type: {maintenanceDetails.typeMaintenance}</MDTypography>
              <MDTypography>Marque: {maintenanceDetails.marque}</MDTypography>
              <MDTypography>Unité: {maintenanceDetails.unite}</MDTypography>
              <MDTypography>Équipement: {maintenanceDetails.codeEquipement}</MDTypography>
              <MDTypography>Ticket: {maintenanceDetails.ticket}</MDTypography>
            </>
          ) : (
            <MDTypography>Chargement...</MDTypography>
          )}
        </MDBox>
      </Modal>

      {/* Modal Modifier Etat Ticket (admin seulement) */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <MDBox
          component="form"
          onSubmit={handleEditSubmit}
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
          <MDTypography variant="h6" mb={2}>
            Modifier
          </MDTypography>

          <TextField
            select
            fullWidth
            label="Statut"
            value={editForm.etat}
            onChange={(e) => setEditForm({ ...editForm, etat: e.target.value })}
            required
          >
            {etatOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {editError && (
            <MDTypography color="error" mt={2} mb={1}>
              {editError}
            </MDTypography>
          )}

          <MDBox display="flex" justifyContent="flex-end" mt={3}>
            <MDButton type="submit" color="info" variant="gradient" disabled={editLoading}>
              {editLoading ? "Modification..." : "Enregistrer"}
            </MDButton>
          </MDBox>
        </MDBox>
      </Modal>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
