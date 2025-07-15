/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import badge from "assets/images/la-poste-tunisienne-logo-png_seeklogo-359957.ico";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useAllTicketsTableData(userId, handleVoir) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "ticket", accessor: "ticket", width: "45%", align: "left" },
      { Header: "Unite", accessor: "unite", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "created", accessor: "created", align: "center" },
      { Header: "details", accessor: "details", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://localhost:8000/api/ticket/list-for-admin/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tickets = response.data;
        const rows = tickets.map((ticket) => ({
          ticket: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
              <MDAvatar src={badge} name={ticket.idTicket} size="sm" />
              <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                  Identifiant : {ticket.idTicket}
                </MDTypography>
                <MDTypography variant="caption">{ticket.description}</MDTypography>
              </MDBox>
            </MDBox>
          ),
          unite: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {ticket.unite}
            </MDTypography>
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={ticket.etat}
                color={
                  ticket.etat.toLowerCase() === "ouvert"
                    ? "success"
                    : ticket.etat.toLowerCase() === "fermé"
                    ? "error"
                    : "warning"
                }
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          created: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {new Date(ticket.dateCreation).toLocaleDateString()}
            </MDTypography>
          ),
          details: (
            <MDTypography
              component="button"
              type="button"
              variant="caption"
              color="text"
              fontWeight="medium"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => handleVoir(ticket.idTicket)}
            >
              Voir
            </MDTypography>
          ),
        }));

        setTableData((prev) => ({
          ...prev,
          rows,
        }));
      } catch (error) {
        console.error("Erreur lors de la récupération des tickets :", error);
        setTableData((prev) => ({
          ...prev,
          rows: [],
        }));
      }
    };

    fetchTickets();
  }, [userId]);

  return tableData;
}
