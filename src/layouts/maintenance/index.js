// src/layouts/maintenance/index.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";

function Maintenance() {
  const [maintenances, setMaintenances] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    description: "",
    equipement: "",
    date: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Fonction pour récupérer toutes les maintenances
  const fetchMaintenances = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://localhost:8000/api/maintenance/list/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(response.data) ? response.data : response.data.results;
      setMaintenances(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des maintenances:", error);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Description", accessor: "description" },
    { Header: "Équipement", accessor: "equipement" },
    { Header: "Date", accessor: "date" },
  ];

  const rows = maintenances;

  // Fonction pour ajouter une maintenance
  const addMaintenance = async (data) => {
    try {
      setAddLoading(true);
      setAddError("");
      const token = localStorage.getItem("access");
      await axios.post("http://localhost:8000/api/maintenance/add/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddOpen(false);
      setAddForm({ description: "", equipement: "", date: "" });
      fetchMaintenances();
    } catch (error) {
      setAddError("Erreur lors de l'ajout de la maintenance.");
      console.error("Erreur lors de l'ajout de la maintenance:", error);
    } finally {
      setAddLoading(false);
    }
  };

  // Handler pour ouvrir le modal
  const handleAddClick = () => {
    setAddOpen(true);
  };

  // Handler pour soumettre le formulaire
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    addMaintenance(addForm);
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
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Liste des maintenances
                </MDTypography>
                <MDButton variant="contained" color="white" onClick={handleAddClick}>
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
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* Modal d'ajout */}
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
            Ajouter une maintenance
          </MDTypography>
          <form onSubmit={handleAddSubmit}>
            <MDBox mb={2}>
              <MDTypography>Description</MDTypography>
              <input
                type="text"
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                style={{ width: "100%" }}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography>Équipement</MDTypography>
              <input
                type="text"
                value={addForm.equipement}
                onChange={(e) => setAddForm({ ...addForm, equipement: e.target.value })}
                style={{ width: "100%" }}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography>Date</MDTypography>
              <input
                type="date"
                value={addForm.date}
                onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
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
              <MDButton type="submit" color="info" variant="gradient" disabled={addLoading}>
                {addLoading ? "Ajout..." : "Enregistrer"}
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Modal>
      <Footer />
    </DashboardLayout>
  );
}

export default Maintenance;
