import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Groups from "./Groups";
import Calendar from "./Calendar";
import Routing from "./Routing";
import Friends from "./Friends";

import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

// sticky navigation bar
/* FIX : if on a new page, nav bar shows up only once user has scrolled */
window.onscroll = function() {stickyNav()};
const navbar = document.getElementById("nav");
const sticky = navbar.offsetTop;

function stickyNav() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

// function App() {
//   return (
//     <div className="app">
//       <Navbar bg="primary" variant="dark">
//         <Container>
//         <Navbar.Brand href="/">Navbar</Navbar.Brand>
//         <Nav className="me-auto">
//           <Nav.Link href="/dashboard">Dashboard</Nav.Link>
//           <Nav.Link href="/profile">Profile</Nav.Link>
//           <Nav.Link href="/groups">Groups</Nav.Link>
//           <Nav.Link href="/calendar">Calendar</Nav.Link>
//           <Nav.Link href="/routing">Routing</Nav.Link>
//           <Nav.Link href="/friends">Friends</Nav.Link>
//         </Nav>
//         </Container>
//       </Navbar>
//     </div>
//   );
// }

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/groups" element={<Groups />} />
          <Route exact path="/calendar" element={<Calendar />} />
          <Route exact path="/routing" element={<Routing />} />
          <Route exact path="/friends" element={<Friends />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
