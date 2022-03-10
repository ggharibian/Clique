import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
// import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Navbar from "./components/navbar"
import "./Profile.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import checkPage from "./CheckPage";

function Profile() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
  
    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
  
        setName(data.name);
        setEmail(data.email);
        setAddress(data.address);
        setPhone(data.phone);
      } catch (err) {
        console.error(err);
        // FIX: This alert message shows up regardless of successful fetch.
        // alert(err.message);
      }
    };

    useEffect(() => {    
        /* ADD BACK IN -- PAGE RETURNS TO HOME PAGE IF NOT LOGGED IN
        if (loading) return;
        if (!user) return navigate("/");
        */
        checkPage();
        fetchUserName();
      }, [user, loading, checkPage]);

    return (
        <div className="wantburger">
            <Navbar />
            <div className="myProfile">
            
                <div className="profileTitle">{name}'s profile</div>
                <div className="user-info">
                    <div class="button-container">
                        <Button variant="primary" size="md" onClick={logout}>
                            logout
                        </Button>
                    </div>
                    <text>
                        <h2><center>About Me</center></h2>
                        <span className="user-info-subtitle">My email is:</span> {email}<br />
                        <span className="user-info-subtitle">My phone is:</span> {phone} <br />
                        <span className="user-info-subtitle">My address is:</span> {address}<br />
                    </text>
                </div>

                <br />

                <div class="profileContainer">
                    <div class="row">
                        <div class="col-lg-6 mb-4">
                            <div class="profCard" display="flex">
                                <img class="card-img-top" src="" alt=""/>
                                <div class="profileText">
                                    <h3>friends</h3>
                                    <p>see my list of friends and their information</p>
                                    <a href="../friends" class="btn btn-outline-primary btn-sm">
                                        see friends
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 mb-4">
                            <div class="profCard" display="flex">
                                <img class="card-img-top" src="" alt=""/>
                                <div class="profileText">
                                    <h3>cliques</h3>
                                    <p>see my cliques</p>
                                    <a href="../mycliques" class="btn btn-outline-primary btn-sm">
                                        see cliques
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-6 mb-4">
                            <div class="profCard">
                                <img class="card-img-top" src="" alt=""/>
                                <div class="profileText" display="flex">
                                    <h3>calendar</h3>
                                    <p>see upcoming planned and potential events</p>
                                    <a href="../calendar" class="btn btn-outline-primary btn-sm">
                                        see calendar
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 mb-4">
                            <div class="profCard" display="flex">
                                <img class="card-img-top" src="" alt=""/>
                                <div class="profileText">
                                    <h3>routing</h3>
                                    <p>see routes and navigation for events</p>
                                    <a href="../routing" class="btn btn-outline-primary btn-sm">
                                        see routes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;