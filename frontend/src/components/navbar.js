// import './navbar.html';
// const navSlide = () => {
//     // icon and make nav bar active
//     const burger = document.querySelector('.burger');
//     const nav = document.querySelector('.nav-links');
 
//     burger.addEventListener('click', ()=>{
//         nav.classList.toggle('nav-active');
//     });
// }
 
// navSlide();
 
import "./navbar.css";
 
import React, { useEffect, useState } from "react"
 
function Navbar() {
   return (
       <nav class="navbar-container">
           <div class="logo">
               <h4>CLIQUE</h4>
           </div>
           <li class="navlink"><a href="../profile">Profile</a></li>
           <li class="navlink"><a href="../groups">Groups</a></li>
           <li class="navlink"><a href="../calendar">Calendar</a></li>
           <li class="navlink"><a href="../routing">Routing</a></li>
       </nav>
   );
}
 
export default Navbar;
