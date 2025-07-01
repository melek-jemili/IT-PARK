// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";

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
import React, { useState, useEffect } from "react";
import useTicketsTableData from "./data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import axios from "axios";

function Tables() {
  const [open, setOpen] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const [addForm, setAddForm] = useState({
    unite: "",
    equipement: "",
    personnel: "",
    description: "",
    dateCreation: "",
    priorite: "",
    etat: "fermé",
    dateResolution: "00:00",
  });

  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

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

  const user = localStorage.getItem("personnel");
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";

  const { columns, rows } = useTicketsTableData(user, handleVoir);
  const { columns: pColumns, rows: pRows } = projectsTableData();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Table Tickets */}
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

                {/* Modal de détails */}
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
                        <MDTypography>
                          Date résolution estimée:{ticketDetails.dateResolution}
                        </MDTypography>
                        <MDTypography>Priorité: {ticketDetails.priorite}</MDTypography>
                        <MDTypography>Unité: {ticketDetails.unite}</MDTypography>
                        <MDTypography>Équipement: {ticketDetails.equipement}</MDTypography>
                        <MDTypography>Personnel: {ticketDetails.personnel}</MDTypography>
                      </>
                    ) : (
                      <MDTypography>Chargement...</MDTypography>
                    )}
                  </MDBox>
                </Modal>

                {/* Modal Ajout ticket */}
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
                      minWidth: 300,
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
                            dateCreation: "",
                            priorite: "",
                            etat: "ferme",
                            dateResolution: "0000-00-00 00:00:00", // format "YYYY-MM-DDTHH:mm"
                          });
                          window.location.reload(); // tu peux aussi refetch uniquement les données
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
                        { label: "Date de création", key: "dateCreation", type: "date" },
                        { label: "Priorité", key: "priorite" },
                      ].map((field) => (
                        <MDBox mb={2} key={field.key}>
                          <MDTypography>{field.label}</MDTypography>
                          <input
                            type={field.type || "text"}
                            value={addForm[field.key]}
                            onChange={(e) =>
                              setAddForm({ ...addForm, [field.key]: e.target.value })
                            }
                            required
                            style={{ width: "100%" }}
                          />
                        </MDBox>
                      ))}
                      <MDBox mb={2}>
                        <MDTypography>Statut</MDTypography>
                        <input
                          type="text"
                          value={addForm.etat}
                          onChange={(e) => setAddForm({ ...addForm, etat: e.target.value })}
                          style={{ width: "100%" }}
                          required
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDTypography>Date résolution</MDTypography>
                        <input
                          type="datetime-local"
                          value={addForm.dateResolution}
                          onChange={(e) =>
                            setAddForm({ ...addForm, dateResolution: e.target.value })
                          }
                          style={{ width: "100%" }}
                          required
                        />
                      </MDBox>
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
              </MDBox>
            </Card>
          </Grid>
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
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
export default Tables;
