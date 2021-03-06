import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import checkPage from "./CheckPage.js"
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import GoogleButton from 'react-google-button'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/profile");
    checkPage()
  }, [user, loading, checkPage]);

  return (
    <div className="login">
      <center>
      <div className="content">
        <Card className="titleCard">
          <Card.Header className="headerCard">
          <div className="titleText"> Clique. </div>
          <div className="subtitle">One click to your Clique</div>
          </Card.Header>

          <Card.Body className="bodyCard">
            <GoogleButton
              type="light"
              label='Sign in With Google'
              size='100'
              onClick={signInWithGoogle}
            />

            <div className="supportText">
              Don't have an account? &nbsp;
              <a href="https://accounts.google.com/SignUp?hl=en" target="_blank">
                  Register
              </a> now.
            </div>
          </Card.Body>
        </Card>
      </div>
      </center>
    </div>
  );
}

export default Login;
