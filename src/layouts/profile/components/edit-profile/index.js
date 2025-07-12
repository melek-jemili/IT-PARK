import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Header from "../Header";
import Footer from "examples/Footer";

function EditProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://localhost:8000/api/Users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("access");
      await axios.put("http://localhost:8000/api/Users/edit/", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setError("Erreur lors de la sauvegarde du profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mt={10} textAlign="center">
          <MDTypography variant="h6">Chargement du profil...</MDTypography>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header>
        <MDBox mt={5} mb={3}>
          <form onSubmit={handleSave}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={4}>
                {/* PlatformSettings could be here if needed */}
              </Grid>
              <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <Card sx={{ width: "100%", p: 3 }}>
                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                    Modifier les informations personnelles
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Matricule"
                        name="matricule"
                        value={userData?.matricule || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <MDInput
                        fullWidth
                        label="Prénom"
                        name="prenom"
                        value={userData?.prenom || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <MDInput
                        fullWidth
                        label="Nom"
                        name="nom"
                        value={userData?.nom || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="CIN"
                        name="cin"
                        value={userData?.cin || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Fonction"
                        name="fonction"
                        value={userData?.fonction || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Date de naissance"
                        name="dateNaissance"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={userData?.dateNaissance || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Région"
                        name="region"
                        value={userData?.region || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={userData?.email || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Téléphone"
                        name="telephone"
                        value={userData?.telephone || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Unité"
                        name="unite"
                        value={userData?.unite || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  {error && (
                    <MDBox mt={2}>
                      <MDTypography variant="caption" color="error">
                        {error}
                      </MDTypography>
                    </MDBox>
                  )}
                  {success && (
                    <MDBox mt={2}>
                      <MDTypography variant="caption" color="success">
                        {success}
                      </MDTypography>
                    </MDBox>
                  )}
                  <MDBox mt={4} display="flex" justifyContent="flex-end">
                    <MDButton variant="gradient" color="info" type="submit" disabled={saving}>
                      {saving ? "Sauvegarde..." : "Enregistrer"}
                    </MDButton>
                  </MDBox>
                </Card>
                <Divider orientation="vertical" sx={{ mx: 0 }} />
              </Grid>
            </Grid>
          </form>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}
export default EditProfile;
