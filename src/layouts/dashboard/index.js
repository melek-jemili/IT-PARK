// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Dashboard components
import UsersOverview from "layouts/dashboard/utilisateurs";
import UnitsOverview from "layouts/dashboard/Unite";
import TicketsOverview from "layouts/dashboard/Tickets";
import EquipementsOverview from "layouts/dashboard/Equipements";
import MaintenancesOverview from "layouts/dashboard/Maintenances";
import TicketPersoOverview from "layouts/dashboard/InfoPersonnelles/TicketsPersonnels";
import MaintenancesPersoOverview from "layouts/dashboard/InfoPersonnelles/MaintenancesPersonnelles";
import EquipementsUser from "layouts/dashboard/InfoPersonnelles/EquipementPerso";

function Dashboard() {
  const isAdminUser = localStorage.getItem("isAdminUser") === "true";

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* ADMIN ZONE */}
      {isAdminUser && (
        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <UsersOverview />
            </Grid>
            <Grid item xs={12}>
              <TicketsOverview />
            </Grid>
            <Grid item xs={12}>
              <UnitsOverview />
            </Grid>
            <Grid item xs={12}>
              <EquipementsOverview />
            </Grid>
            <Grid item xs={12}>
              <MaintenancesOverview />
            </Grid>
          </Grid>
        </MDBox>
      )}

      {/* ZONE UTILISATEUR */}
      <MDBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TicketPersoOverview />
          </Grid>
          <Grid item xs={12} md={6}>
            <MaintenancesPersoOverview />
          </Grid>
          <Grid item xs={12} md={6}>
            <EquipementsUser />
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
