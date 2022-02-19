import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Dashboard() {
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
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);



  return (
    <div className="dashboard">
      <center>
      <div className="content">
        <Card border="info" className="d_titleCard">
          <Card.Header className="d_headerCard">
          <div className="d_titleText"> Welcome, {name}. </div>
          <div className="d_subtitle"> {user?.email} </div>
          </Card.Header>

          <Card.Body className="d_  bodyCard">
              <Button variant="primary" size="lg" onClick={logout}>
                Click to Logout
              </Button>{' '}
          </Card.Body>
        </Card>
      </div>
      </center>


    </div>
  );
}

export default Dashboard;
