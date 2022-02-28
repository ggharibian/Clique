import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Registration.css";
import { auth, db } from "./firebase";
import { query, collection, getDocs, setDoc, doc, where } from "firebase/firestore";

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form'

function Registration () {
    const [user, loading, error] = useAuthState(auth);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [license, setLicense] = useState("");
    const [permit, setPermit] = useState("");
    const [car, setCar] = useState("");
    const [food, setFood] = useState("");
    const [place, setPlace] = useState("");
    const [song, setSong] = useState("");
    const [movie, setMovie] = useState("");
    const [book, setBook] = useState("");
  
    // obtain information already in database - name and email
    const fetchInfo = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const docwanted = await getDocs(q);
        const data = docwanted.docs[0].data();
  
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Clicked submit");

        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const docwanted = await getDocs(q);

        await setDoc(doc(db, "users", docwanted.docs[0].id), {
            uid: user.uid,
            authProvider: "google",
            email: email,
            name: name,
            license: license,
            permit: permit,
            car: car,
            food: food,
            place: place,
            song: song,
            movie: movie,
            book: book
        })
          .then(() => {
            
            window.location = '/dashboard';
          })
          .catch((error) => {
            alert(error.message);
          });
    
        setName("");
        setEmail("");
        setLicense("");
        setPermit("");
        setCar("");
        setFood("");
        setPlace("");
        setSong("");
        setMovie("");
        setBook("");
      };

    useEffect(() => {    
        fetchInfo();
      }, [user]);

    return (
    <center>
        <div className="profile">
            <div className="container">
                <h1 className="title">You are just one Clique away!</h1>
                <h2 className="info-subtitle">Please fill out some more information about yourself:</h2>
                <hr></hr>

                <Form className="info-form" onSubmit={handleSubmit}>
                    <h4 className="subtitle"> Personal Information </h4>
                    <Form.Group className="mb-3 personal-item" controlId="formBasicEmail">
                        <Form.Label className="personal-label">Email: </Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setName(e.target.value)} plaintext readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3 personal-item" controlId="forbasicName">
                        <Form.Label className="personal-label">Preferred Name: </Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3 personal-item" controlId="forAddress">
                        <Form.Label className="personal-label">Preferred Name: </Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>

                    <h4 className="subtitle"> Driving Capabilities </h4>
                    <Form.Group className="mb-3 radiobtn-input" controlId="forlicense">
                        <Form.Label>Do you have a license: </Form.Label>
                        <div class="radiobtn-container">
                            <Form.Check className="radio-bubble" inline label="yes" name="license" type="radio" id={`inline-radio-1`} value="yes" onChange={(e) => setLicense(e.target.value)}/>
                            <Form.Check className="radio-bubble" inline label="no" name="license" type="radio" id={`inline-radio-2`} value="no" onChange={(e) => setLicense(e.target.value)}/>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 radiobtn-input" controlId="forPermit">
                        <Form.Label>Do you have a permit: </Form.Label>
                        <div class="radiobtn-container">
                            <Form.Check className="radio-bubble" inline label="yes" name="Permit" type="radio" id={`inline-radio-1`} value="yes" onChange={(e) => setPermit(e.target.value)}/>
                            <Form.Check className="radio-bubble" inline label="no" name="Permit" type="radio" id={`inline-radio-2`} value="no" onChange={(e) => setPermit(e.target.value)}/>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 radiobtn-input" controlId="forCar">
                        <Form.Label>Do you own / have access to a car: </Form.Label>
                        <div class="radiobtn-container">
                            <Form.Check className="radio-bubble" inline label="yes" name="Car" type="radio" id={`inline-radio-1`} value="yes" onChange={(e) => setCar(e.target.value)}/>
                            <Form.Check className="radio-bubble" inline label="no" name="Car" type="radio" id={`inline-radio-2`} value="no" onChange={(e) => setCar(e.target.value)}/>
                        </div>
                    </Form.Group>

                    <h4 className="subtitle">What is your favorite:</h4>
                    <Form.Group className="mb-3 favorite-item" controlId="for">
                        <Form.Label className="favorite-label">Food: </Form.Label>
                        <Form.Control type="text" placeholder="Enter anything" value={food} onChange={(e) => setFood(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3 favorite-item" controlId="forbasicName">
                        <Form.Label className="favorite-label">Place: </Form.Label>
                        <Form.Control type="text" placeholder="Enter anything" value={place} onChange={(e) => setPlace(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3 favorite-item" controlId="forbasicName">
                        <Form.Label className="favorite-label">Song: </Form.Label>
                        <Form.Control type="text" placeholder="Enter anything" value={song} onChange={(e) => setSong(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3 favorite-item" controlId="forbasicName">
                        <Form.Label className="favorite-label">Movie: </Form.Label>
                        <Form.Control type="text" placeholder="Enter anything" value={movie} onChange={(e) => setMovie(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3 favorite-item" controlId="forbasicName">
                        <Form.Label className="favorite-label">Book: </Form.Label>
                        <Form.Control type="text" placeholder="Enter anything" value={book} onChange={(e) => setBook(e.target.value)}/>
                    </Form.Group>
                    <Button variant="primary" type="submit"> Submit </Button>
                </Form>
            </div>
        </div>
    </center>
    );

    //on submit want to redirect to dashboard
    //want on submit to enter data in database
}

export default Registration;
