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
import React, { useState } from "react";
import useUniteTableData from "./data/uniteDataTable";
import axios from "axios";

function Tables() {
  const [open, setOpen] = useState(false);
  const [uniteDetails, setUniteDetails] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

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

  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const handleVoir = async (id) => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`http://localhost:8000/api/unite/detail/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUniteDetails(response.data);
      setOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'unité :", error);
    }
  };

  const user = localStorage.getItem("personnel");
  const { columns, rows } = useUniteTableData(user, handleVoir);

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
                  Les Unités
                </MDTypography>
                <MDButton color="white" variant="contained" onClick={() => setAddOpen(true)}>
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
                      maxHeight: "80vh",
                      overflowY: "auto",
                    }}
                  >
                    {uniteDetails ? (
                      <>
                        <MDTypography variant="h6" mb={2}>
                          Détails unité
                        </MDTypography>
                        <MDTypography>Code postal : {uniteDetails.codePostal}</MDTypography>
                        <MDTypography>Nom : {uniteDetails.nom}</MDTypography>
                        <MDTypography>Classe : {uniteDetails.classe}</MDTypography>
                        <MDTypography>Gouvernorat : {uniteDetails.gouvernorat}</MDTypography>
                        <MDTypography>Adresse : {uniteDetails.adresse}</MDTypography>
                        <MDTypography>
                          Nombre d&apos;employés : {uniteDetails.nombreEmployes}
                        </MDTypography>
                        <MDTypography>
                          Nombre de guichets : {uniteDetails.nombreGuichets}
                        </MDTypography>
                        <MDTypography>Chef unité : {uniteDetails.chefUnité}</MDTypography>
                        <MDTypography>Plage IP : {uniteDetails.plageIP}</MDTypography>
                        <MDTypography>Type Liaison 1 : {uniteDetails.typeLiason1}</MDTypography>
                        <MDTypography>Type Liaison 2 : {uniteDetails.typeLiason2}</MDTypography>
                        <MDTypography>ID Liaison 1 : {uniteDetails.idLiaison1}</MDTypography>
                        <MDTypography>ID Liaison 2 : {uniteDetails.idLiaison2}</MDTypography>
                      </>
                    ) : (
                      <MDTypography>Chargement...</MDTypography>
                    )}
                  </MDBox>
                </Modal>

                {/* Modal Ajout unité */}
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
                      maxHeight: "80vh",
                      overflowY: "auto",
                    }}
                  >
                    <MDTypography variant="h6" mb={2}>
                      Ajouter une unité
                    </MDTypography>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setAddLoading(true);
                        setAddError("");
                        try {
                          const token = localStorage.getItem("access");

                          await axios.post(
                            "http://localhost:8000/api/unite/add/",
                            {
                              codePostal: parseInt(addForm.codePostal),
                              nom: addForm.nom,
                              classe: addForm.classe,
                              gouvernorat: addForm.gouvernorat,
                              adresse: addForm.adresse,
                              nombreEmployes: parseInt(addForm.nombreEmployes),
                              nombreGuichets: parseInt(addForm.nombreGuichets),
                              chefUnité: addForm.chefUnité,
                              plageIP: addForm.plageIP,
                              typeLiason1: addForm.typeLiason1,
                              typeLiason2: addForm.typeLiason2,
                              idLiaison1: parseInt(addForm.idLiaison1) || 0,
                              idLiaison2: parseInt(addForm.idLiaison2) || 0,
                            },
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );

                          setAddOpen(false);
                          setAddForm({
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
                          window.location.reload();
                        } catch (err) {
                          setAddError("Erreur lors de la création de l'unité.");
                          console.error(err.response?.data || err.message);
                        } finally {
                          setAddLoading(false);
                        }
                      }}
                    >
                      {[
                        { label: "Code postal", key: "codePostal", type: "number" },
                        { label: "Nom", key: "nom" },
                        { label: "Classe", key: "classe" },
                        { label: "Gouvernorat", key: "gouvernorat" },
                        { label: "Adresse", key: "adresse" },
                        { label: "Nombre d'employés", key: "nombreEmployes", type: "number" },
                        { label: "Nombre de guichets", key: "nombreGuichets", type: "number" },
                        { label: "Chef d'unité", key: "chefUnité" },
                        { label: "Plage IP", key: "plageIP" },
                        { label: "Type Liaison 1", key: "typeLiason1" },
                        { label: "Type Liaison 2", key: "typeLiason2" },
                        { label: "ID Liaison 1", key: "idLiaison1", type: "number" },
                        { label: "ID Liaison 2", key: "idLiaison2", type: "number" },
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
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
