import { useEffect, useState } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
//import MDTypography from "components/MDTypography";

// Layout & components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
//import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Page parts
import Header from "layouts/profile/components/Header";
//import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
//import profilesListData from "layouts/profile/data/profilesListData";

// Images
/*
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
*/

function Overview() {
  const [userData, setUserData] = useState(null);

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
      } catch (error) {
        console.error("Erreur API /me :", error);
      }
    };

    fetchUser();
  }, []);

  // Render the profile overview page
  return (
    <DashboardLayout>
      {/* Top navigation bar */}
      <DashboardNavbar />
      <MDBox mb={2} />
      {/* Header section */}
      <Header>
        <MDBox mt={5} mb={3}>
          {/* User profile info card */}
          <Grid
            item
            xs={12}
            md={6}
            xl={4}
            sx={{ display: "flex" }}
            container
            justifyContent="center"
          >
            {/* Vertical divider */}
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="Informations personnelles"
              description={
                userData
                  ? `Bonjour ${userData.prenom}, vous êtes actuellement affecté(e) en tant que ${userData.fonction}.`
                  : "Chargement des données..."
              }
              info={{
                Matricule: userData?.matricule || "N/A",
                Nom: userData ? `${userData.prenom} ${userData.nom}` : "N/A",
                CIN: userData?.cin || "N/A",
                Fonction: userData?.fonction || "N/A",
                "Date de naissance": userData?.dateNaissance || "N/A",
                Région: userData?.region || "N/A",
                Email: userData?.email || "N/A",
                Téléphone: userData?.telephone || "N/A",
                Unité: userData?.unite || "N/A",
              }}
              action={{ route: "profile/edit-profile", tooltip: "Modifier le profil" }}
              shadow={false}
            />
            {/* Another vertical divider */}
            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
        </MDBox>
      </Header>
      {/* Footer section */}
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
