/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useTicketsTableData(userId, handleVoir) {
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "ticket", accessor: "ticket", width: "45%", align: "left" },
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
        const response = await axios.get("http://localhost:8000/api/ticket/list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tickets = response.data;
        const rows = tickets.map((ticket) => ({
          ticket: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
              <MDAvatar src={team2} name={ticket.idTicket} size="sm" />
              <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                  Identifiant : {ticket.idTicket}
                </MDTypography>
                <MDTypography variant="caption">{ticket.description}</MDTypography>
              </MDBox>
            </MDBox>
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
  }, [userId]); // handleVoir retiré pour éviter les appels infinis

  return tableData;
}
