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

  const user = localStorage.getItem("personnel");
  const { columns, rows } = useEquipementsTableData(user, handleVoir);

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
                    {equipementDetails ? (
                      <>
                        <MDTypography variant="h6">Détails équipement</MDTypography>
                        <MDTypography>Code à barre: {equipementDetails.codeABarre}</MDTypography>
                        <MDTypography>Nom: {equipementDetails.nom}</MDTypography>
                        <MDTypography>
                          Numéro de série: {equipementDetails.numeroSerie}
                        </MDTypography>
                        <MDTypography>Modèle: {equipementDetails.modele}</MDTypography>
                        <MDTypography>Marque: {equipementDetails.marque}</MDTypography>
                        <MDTypography>Type: {equipementDetails.type}</MDTypography>
                        <MDTypography>État: {equipementDetails.etat}</MDTypography>
                        <MDTypography>
                          Date de mise en service: {equipementDetails.dateMiseEnService}
                        </MDTypography>
                        <MDTypography>Adresse IP: {equipementDetails.adresseIP}</MDTypography>
                        <MDTypography>Adresse MAC: {equipementDetails.adresseMAC}</MDTypography>
                        <MDTypography>Unité: {equipementDetails.unite}</MDTypography>
                      </>
                    ) : (
                      <MDTypography>Chargement...</MDTypography>
                    )}
                  </MDBox>
                </Modal>

                {/* Modal Ajout équipement */}
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
                      Ajouter un équipement
                    </MDTypography>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setAddLoading(true);
                        setAddError("");
                        try {
                          const token = localStorage.getItem("access");

                          await axios.post(
                            "http://localhost:8000/api/equipements/add/",
                            {
                              codeABarre: parseInt(addForm.codeABarre),
                              nom: addForm.nom,
                              numeroSerie: parseInt(addForm.numeroSerie),
                              modele: addForm.modele,
                              marque: addForm.marque,
                              type: addForm.type,
                              etat: addForm.etat,
                              dateMiseEnService: addForm.dateMiseEnService,
                              adresseIP: addForm.adresseIP,
                              adresseMAC: addForm.adresseMAC,
                              unite: parseInt(addForm.unite),
                            },
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
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
                          console.error(err.response?.data || err.message);
                        } finally {
                          setAddLoading(false);
                        }
                      }}
                    >
                      {[
                        { label: "Code à barre", key: "codeABarre", type: "number" },
                        { label: "Nom", key: "nom" },
                        { label: "Numéro de série", key: "numeroSerie", type: "number" },
                        { label: "Modèle", key: "modele" },
                        { label: "Marque", key: "marque" },
                        { label: "Type", key: "type" },
                        { label: "État", key: "etat" },
                        {
                          label: "Date de mise en service",
                          key: "dateMiseEnService",
                          type: "date",
                        },
                        { label: "Adresse IP", key: "adresseIP" },
                        { label: "Adresse MAC", key: "adresseMAC" },
                        { label: "Unité (ID)", key: "unite", type: "number" },
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
