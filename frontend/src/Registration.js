import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Registration.css";
import checkPage from "./CheckPage.js"
import { auth, db } from "./firebase";
import { query, collection, getDocs, setDoc, doc, where } from "firebase/firestore";

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import PlacesAutoComplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";

// Component for alert
function AlertError({show, setShow}) {
    if (show) {
      return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading className="alert-text">Please fill out all the fields before submitting!</Alert.Heading>
        </Alert>
      );
    } else {
        return null;
    }
}
  
// Component for registration
function Registration () {

    // Initialize states
    const [user] = useAuthState(auth);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [license, setLicense] = useState("");
    const [permit, setPermit] = useState("");
    const [car, setCar] = useState("");
    const [food, setFood] = useState("");
    const [place, setPlace] = useState("");
    const [song, setSong] = useState("");
    const [movie, setMovie] = useState("");
    const [book, setBook] = useState("");
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState({
        lat: null,
        long: null
    });
    const [isValid, setIsValid] = useState(true);
    const [show, setShow] = useState(true);

    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value)
        const latlng = await getLatLng(results[0])
        setAddress(value)
        setCoordinates(latlng)
    }
  
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
        //alert("An error occured while fetching user data");
      }
    };

    // On submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // If any fields are un filled
        if(!name || !license || !permit || !car || !food || !place || !song || !movie || !book || !phone) {
            setIsValid(false);
            setShow(true);
        } else { // Set values in data base
            setIsValid(true);
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const docwanted = await getDocs(q);

            await setDoc(doc(db, "users", docwanted.docs[0].id), {
                uid: user.uid,
                authProvider: "google",
                email: email,
                phone: phone,
                name: name,
                friends: [],
                groups: [],
                license: license,
                permit: permit,
                car: car,
                food: food,
                place: place,
                song: song,
                movie: movie,
                book: book,
                address: address
            })
            .then(() => {
                window.location = '/profile';
            })
            .catch((error) => {
                alert(error.message);
            });
        }
      };

      
    // Obtain information
    useEffect(() => {  
        fetchInfo();
        checkPage();
      }, [user, checkPage]);

    
    return (
    <center>
        <div className="registration">
            <div className="container">
            {isValid ? null : <AlertError show={show} setShow={setShow}/>}
                <h1 className="title">You are just one Clique away!</h1>
                <h2 className="info-subtitle">Please fill out some more information about yourself:</h2>
                <hr></hr>

                <Form className="info-form" onSubmit={handleSubmit}>
                    <h4 className="subtitle-reg"> Personal Information </h4>
                    <Form.Group className="mb-3 personal-item" controlId="formBasicEmail">
                        <Form.Label className="personal-label">Email: </Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setName(e.target.value)} plaintext readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3 personal-item" controlId="forbasicName">
                        <Form.Label className="personal-label">Preferred Name: </Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3 personal-item" controlId="forbasicName">
                        <Form.Label className="personal-label">Phone number: </Form.Label>
                        <input id="validationDefault01" class="form-control" type="text" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                    </Form.Group>

                    <Form.Group className="mb-3 personal-item" controlId="forAddress">
                        <Form.Label className="personal-label">Address: </Form.Label>
                        <PlacesAutoComplete className="personal-label" value={address} onChange={setAddress} onSelect={handleSelect}>
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    {/* onChange={(e) => setAddress(e.target.value)} */}
                                    <Form.Control style={{width: "40.50vmax"}}{...getInputProps()} type="text" placeholder="Enter your address (use arrow keys and enter for autocomplete)" value={address} />
                                    <div>
                                        {loading ? <div>loading...</div> : null}

                                        {suggestions.map((suggestion) => {
                                            const style = {
                                                backgroundColor: suggestion.active ? "#E7E5E5" : "#fff"
                                            }

                                            return <div {...getSuggestionItemProps( suggestion,{ style })}>{suggestion.description}</div>
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutoComplete>
                        {/* <Form.Control type="text" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} /> */}

                    </Form.Group>
                    <hr />
                    <h4 className="subtitle-reg"> Driving Capabilities </h4>
                    <Form.Group className="mb-3 radiobtn-input" controlId="forlicense">
                        <Form.Label>Do you have a license: </Form.Label>
                        <div className="radiobtn-container">
                            <Form.Check className="radio-bubble" inline label="yes" name="license" type="radio" id={`inline-radio-1`} value="yes" onChange={(e) => setLicense(e.target.value)}/>
                            <Form.Check className="radio-bubble" inline label="no" name="license" type="radio" id={`inline-radio-2`} value="no" onChange={(e) => setLicense(e.target.value)}/>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 radiobtn-input" controlId="forPermit">
                        <Form.Label>Do you have a permit: </Form.Label>
                        <div className="radiobtn-container">
                            <Form.Check className="radio-bubble" inline label="yes" name="Permit" type="radio" id={`inline-radio-1`} value="yes" onChange={(e) => setPermit(e.target.value)}/>
                            <Form.Check className="radio-bubble" inline label="no" name="Permit" type="radio" id={`inline-radio-2`} value="no" onChange={(e) => setPermit(e.target.value)}/>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 radiobtn-input" controlId="forCar">
                        <Form.Label>Do you own / have access to a car: </Form.Label>
                        <div className="radiobtn-container">
                            <Form.Check className="radio-bubble" inline label="yes" name="Car" type="radio" id={`inline-radio-1`} value="yes" onChange={(e) => setCar(e.target.value)}/>
                            <Form.Check className="radio-bubble" inline label="no" name="Car" type="radio" id={`inline-radio-2`} value="no" onChange={(e) => setCar(e.target.value)}/>
                        </div>
                    </Form.Group>
                    <hr />
                    <h4 className="subtitle-reg">What is your favorite:</h4>
                    <Form.Group className="mb-3 favorite-item" controlId="for">
                        <Form.Label className="favorite-label">Food: </Form.Label>
                        <Form.Control type="text" placeholder="e.g. sushi, burgers, ice cream, etc." value={food} onChange={(e) => setFood(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3 favorite-item" controlId="forbasicName">
                        <Form.Label className="favorite-label">Place: </Form.Label>
                        <Form.Control type="text" placeholder="e.g. Hawaii, UCLA, home, etc." value={place} onChange={(e) => setPlace(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3 favorite-item" controlId="forbasicName">
                        <Form.Label className="favorite-label">Song: </Form.Label>
                        <Form.Control type="text" placeholder="e.g. Classic, Party in the USA, Treasure, etc." value={song} onChange={(e) => setSong(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3 favorite-item" controlId="forbasicName">
                        <Form.Label className="favorite-label">Movie: </Form.Label>
                        <Form.Control type="text" placeholder="e.g. Star Wars, Batman, Hulk, etc." value={movie} onChange={(e) => setMovie(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3 favorite-item" controlId="forbasicName">
                        <Form.Label className="favorite-label">Book: </Form.Label>
                        <Form.Control type="text" placeholder="e.g. Scat, Holes, Hunger Games, etc." value={book} onChange={(e) => setBook(e.target.value)}/>
                    </Form.Group>
                    <Button variant="primary" type="submit"> Submit </Button>
                </Form>
            </div>
        </div>
    </center>
    );
}

export default Registration;
