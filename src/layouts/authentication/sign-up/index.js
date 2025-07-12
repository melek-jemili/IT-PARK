// Cover.jsx

// @mui & react-router-dom
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Material Dashboard 2 React components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Image
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", { username, email, password });

    try {
      const response = await axios.post("http://localhost:8000/api/Users/register/", {
        username,
        email,
        password,
      });

      // Optionnel : récupérer les tokens (si l’API les renvoie)
      const { access, refresh } = response.data || {};

      if (access && refresh) {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
      }

      // Redirection après inscription
      navigate("/authentication/sign-in");
    } catch (err) {
      console.error(err);
      setError("Échec de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            La Poste Tunisienne
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Créez un compte pour commencer
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nom d'utilisateur"
                variant="standard"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mot de passe"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                onClick={handleSetRememberMe}
              >
                {"\u00A0\u00A0"}J&apos;accepte{"\u00A0"}
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Termes et Conditions
              </MDTypography>
            </MDBox>

            {error && (
              <MDBox mt={2}>
                <MDTypography variant="caption" color="error">
                  {error}
                </MDTypography>
              </MDBox>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Sign Up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Avez-vous déjà un compte?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Se connecter
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
