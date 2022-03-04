import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Groups from "./Groups";
import Calendar from "./Calendar";
import Routing from "./Routing";
import Friends from "./Friends";
import Registration from "./Registration";

// sticky navigation bar
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
          <Route exact path="/registration" element={<Registration />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
