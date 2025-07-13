import React, { useState } from "react";
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

function ChangePassword() {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.new_password !== formData.new_password_confirm) {
      setError("La confirmation du nouveau mot de passe ne correspond pas.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("access");
      await axios.put(
        "http://localhost:8000/api/Users/change_password/",
        {
          old_password: formData.old_password,
          new_password: formData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Mot de passe modifié avec succès !");
      setFormData({
        old_password: "",
        new_password: "",
        new_password_confirm: "",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors du changement du mot de passe.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header>
        <MDBox mt={5} mb={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={12} md={6} xl={4}>
                <Card sx={{ p: 3 }}>
                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                    Changer le mot de passe
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Ancien mot de passe"
                        name="old_password"
                        type="password"
                        value={formData.old_password}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Nouveau mot de passe"
                        name="new_password"
                        type="password"
                        value={formData.new_password}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <MDInput
                        fullWidth
                        label="Confirmer le nouveau mot de passe"
                        name="new_password_confirm"
                        type="password"
                        value={formData.new_password_confirm}
                        onChange={handleChange}
                        required
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
                      {saving ? "Modification..." : "Modifier le mot de passe"}
                    </MDButton>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </form>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default ChangePassword;
