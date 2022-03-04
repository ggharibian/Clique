import React, { useEffect, useState } from "react";
import "./Profile.css";

import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

function Profile() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();
  
    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
  
        setName(data.name);
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
        fetchUserName();
      }, [user, loading]);

    return (
        <center>
        <div className="profile">
            <div className="title">{name}'s profile</div>
            <br />

            <div className="user-info">

                {/* sADD IN OTHER USER INFO HERE BELOW : PLACEHOLDER TEXT */}
                <text>
                    *** placeholder text *** <br />
                    My email is: <br />
                    My phone is: <br />
                    My address is: <br />
                </text>
            </div>

            <br />

            <div class="container">
                <div class="row">
                    <div class="col-lg-6 mb-4">
                        <Card classname="card" style={{ width: '25rem' }}>
                            <img class="card-img-top" src="" alt=""/>
                            <div class="text">
                                <h3>friends</h3>
                                <p>see my list of friends and their information</p>
                                <a href="../friends" class="btn btn-outline-primary btn-sm">
                                    see friends
                                </a>
                            </div>
                        </Card>
                    </div>
                    <div class="col-lg-6 mb-4">
                        <div class="card" style={{ width: '25rem' }}>
                            <img class="card-img-top" src="" alt=""/>
                            <div class="text">
                                <h3>groups</h3>
                                <p>see my friend groups</p>
                                <a href="../groups" class="btn btn-outline-primary btn-sm">
                                    see friend groups
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-6 mb-4">
                        <div class="card" style={{ width: '25rem' }}>
                            <img class="card-img-top" src="" alt=""/>
                            <div class="text">
                                <h3>calendar</h3>
                                <p>see upcoming planned and potential events</p>
                                <a href="../calendar" class="btn btn-outline-primary btn-sm">
                                    see calendar
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 mb-4">
                        <div class="card" style={{ width: '25rem' }}>
                            <img class="card-img-top" src="" alt=""/>
                            <div class="text">
                                <h3>map</h3>
                                <p>see routes for upcoming events</p>
                                <a href="../routing" class="btn btn-outline-primary btn-sm">
                                    see routes
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
        </center>
    );
}

export default Profile;