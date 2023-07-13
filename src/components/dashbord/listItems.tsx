import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface User {
  role: string;
}

export const mainListItems = () => {
  const storedUser = localStorage.getItem("user");
  let userRole = "";
  console.log("userRole" + userRole);

  if (storedUser) {
    const parsedUser: { message: string; user: User } = JSON.parse(storedUser);
    userRole = parsedUser.user?.role || "";
  }

  return (
    <React.Fragment>
      <ListItemButton href="/profile">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="User Page" />
      </ListItemButton>
      <ListItemButton href="/questions">
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Questions" />
      </ListItemButton>

      {userRole === "Teacher" && (
        <>
        <ListItemButton href="/addquestions">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Add Questions" />
        </ListItemButton>

        <ListItemButton href="/students">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Students" />
        </ListItemButton>
        </>
      )}
      {userRole === "Teacher" && (
        <ListItemButton>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Students answers" />
        </ListItemButton>
      )}
    </React.Fragment>
  );
};

export const secondaryListItems = () => {
  const storedUser = localStorage.getItem("user");
  let userRole = "";
  console.log("userRole" + userRole);

  if (storedUser) {
    const parsedUser: { message: string; user: User } = JSON.parse(storedUser);
    userRole = parsedUser.user?.role || "";
  }
  return (
    <React.Fragment>
      {userRole === "Teacher" && (
        <>
          <ListSubheader component="div" inset>
            Fetchers
          </ListSubheader>
          <ListItemButton href="/ide">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Ide" />
          </ListItemButton>

          <ListItemButton href="/chatbot">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="ChatBot" />
          </ListItemButton>
        </>
      )}
    </React.Fragment>
  );
};
