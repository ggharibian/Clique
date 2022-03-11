import React, { useState } from "react";
import "./Calendar.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import ListGroup from 'react-bootstrap/ListGroup';
import TimeRange from 'react-time-range';
import Form from 'react-bootstrap/Form';
import Navbar from "./components/navbar";
import Badge from "react-bootstrap/Badge";
import Spinner from 'react-bootstrap/Spinner';
import DateTimePicker from 'react-datetime-picker';

import PlacesAutoComplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";

import { db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { query, collection, getDocs, where, doc, updateDoc, arrayUnion, arrayRemove, addDoc } from "firebase/firestore";

function getScheduledMeetings(eventDescs) {

  console.log(eventDescs); 

  if (!eventDescs)
  {
      return(
          <div className="spinner"> 
            <Spinner animation="border" height="200px" width="200px" />
          </div> 
        );
  }

  var nextEvents = []; 
  var pastEvents = []; 
  var accordion; 
  var today = new Date(); 
  for(var i = 0; i < eventDescs.length; i++)
  {
    const event = eventDescs[i];
    accordion = createEventAccordion(eventDescs[i], i); 
    const eventDate = new Date(eventDescs[i].StartTime); 

    console.log(event); 
    console.log(event.StartTime);
    console.log(eventDate); 
    //console.log(today); 

    if (eventDate > today) { nextEvents.push(accordion); }
    else { pastEvents.push(accordion); }

    console.log(i); 
  }

  console.log("Creating new events"); 

    return (
      <div>
        <div className="cal_regtext"> Upcoming Events: </div>
        <Accordion>
          {nextEvents}
        </Accordion>
  
        <div className="cal_regtext"> Previous Events: </div>
        <Accordion>
          {pastEvents}
        </Accordion>
      </div>
    );
  }
  
function createEventAccordion(event, i) {

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(event.StartTime); 
  const header = months[date.getMonth()] + " " + date.getDay() + ", " + date.getFullYear() + " - " + event.EventName; 
  return(
    <Accordion.Item eventKey={i} className="past">
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Body>
        <div> {event.EventDescription} </div> 
        <br/>
        Address: {event.LocAddress}
      </Accordion.Body>
  </Accordion.Item>
  ); 
}

function addNewCalendarEvent(groupID, group, startTime, endTime, title, descrip, address) {
  const id = String(Math.floor(Math.random() * 1000000));
  console.log(id); 
  console.log(title); 
  console.log(group); 

  const startUTF = startTime.toISOString(); 
  const endUTF = endTime.toISOString(); 

  console.log(startUTF); 
  console.log(endUTF); 

  const createGroupEvent = async() => {
    try {
        // Add Event id to Group's Event List 
        const currGroup = String(groupID);
        console.log(currGroup); 

        const currentUserQuery = query(collection(db, "groups"), where("gid", "==", currGroup));
        const getUserDoc = await getDocs(currentUserQuery);
        const userDocId = getUserDoc.docs[0].id;
        console.log("1");
        const userDoc = doc(db, "groups", userDocId);
        await updateDoc(userDoc, {
            Events: arrayUnion(id)
        });

        console.log("Added to Event List!")
        // Create new Event and add information! 
        
        await addDoc(collection(db, "events"), {
          EndTime: endUTF,
          EventDescription: descrip,
          EventName: title,
          LocAddress: address,
          StartTime: startUTF, 
          TimeZone: "America/Los_Angeles",
          eid: id
        });

    } catch (err) {
        //alert("CREATE EVENT: Error writing new event to Firebase")
        console.error(err);
    }
  };
  createGroupEvent();
}

function ChooseMeetingTImes(groupID, group) {
  const [startTime, changeStart] = useState(new Date());
  const [endTime, changeEnd] = useState(new Date());
  const [descrip, setDescrip] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value)
    const latlng = await getLatLng(results[0])
    setAddress(value)
    setCoordinates(latlng)
  }

  const [coordinates, setCoordinates] = useState({
    lat: null,
    long: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(startTime); 
    console.log(endTime); 
    console.log(descrip); 
    console.log(address); 
    console.log(title)

    if (startTime > endTime || startTime < new Date()) 
    {
      alert("DATES: Incorrect or invalid dates entered (past or start > end)");
      changeStart(new Date()); 
      changeEnd(new Date()); 
    } 
    else if (title == "")
    {
      alert("TITLE: Need to enter a title for event!");
      setTitle("");
    }
    else if (descrip == "") 
    {
      alert("DESCPRITION: Need to enter a description for event!");
      setDescrip("");
    }
    else if (address == "")
    {
      alert("ADDRESS: Need to enter a valid address for event!");
      setAddress("");
    }
    else 
    {
      // Means we can log the data / create a new Firebase event! 
      addNewCalendarEvent(groupID, group, startTime, endTime, title, descrip, address); 
      changeStart(new Date()); 
      changeEnd(new Date()); 
      setTitle("")
      setDescrip("");
      setAddress("");
      alert("New Event successfully created and added to database!")
    }
  };

    return(
      <div>
        <div className="cal_regtext"> Schedule Event: </div>

        <div className="cal_form">
        <Row> 
          <Col sm={3}> Start Time: </Col>  
          <Col sm={8} class = "no-gutters"> <DateTimePicker className="cal_datePicker" onChange={changeStart} value={startTime} /> </Col> 
        </Row>
        <br/>
        <Row> 
          <Col sm={3}> End Time: </Col>  
          <Col sm={8} class = "no-gutters"> <DateTimePicker className="cal_datePicker" onChange={changeEnd} value={endTime} /> </Col> 
        </Row>
        <br/>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>What's this chapter called?</Form.Label>
            <Form.Control type="text" onChange={(e) => setTitle(e.target.value)} value={title} placeholder="How our glorious day will be remembered..." />
            <br/>
            <Form.Label>What's our next adventure?</Form.Label>
            <Form.Control type="text" onChange={(e) => setDescrip(e.target.value)} value={descrip} placeholder="We'll sail off into the sunset..." /> 
            <br/>
            <Form.Label className="personal-label">Where are we headed?</Form.Label>
            <PlacesAutoComplete className="personal-label" value={address} onChange={setAddress} onSelect={handleSelect}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  {/* onChange={(e) => setAddress(e.target.value)} */}
                  <Form.Control {...getInputProps()} type="address" placeholder="123 Sesame Street..." value={address}/>
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
          </Form.Group>
          <div className="cal_schedEvent">
              <Button variant="success" type="submit">Schedule</Button>{' '}
          </div>
        </Form>
      </div>
      </div>
    );
  }

function createBadge(id, colorMemMapping, memberNameMapping)
{
    //console.log(memberNameMapping); 
    //console.log(colorMemMapping[id]); 

    const styles = {
        customBadge: {
            backgroundColor: colorMemMapping[id],
            color: "#FFFFFF", 
        }
    };

    return(<ListGroup.Item className={styles.customBadge} style={styles.customBadge}>{memberNameMapping[id]}</ListGroup.Item>); 
    //return (<Badge className={styles.customBadge} style={styles.customBadge}>{id}</Badge>);
}

function miscStatistics(avg, total, events, members, colorMemMapping, memberNameMapping) {

    //console.log(colorMemMapping);
    //console.log(members);
    //console.log(memberNameMapping); 

    //<Badge bg="secondary">New</Badge>

    if (!members || !memberNameMapping)
    {
        return(
            <div className="spinner"> 
              <Spinner animation="border" height="200px" width="200px" />
            </div> 
          );
    }

    // for (var i = 0; i < memberNameMapping.length; i++)
    // {
    //     if (typeof memberNameMapping[members[i]] === 'undefined')
    //     {
    //         return(
    //             <div className="spinner"> 
    //               <Spinner animation="border" height="200px" width="200px" />
    //             </div> 
    //           );
    //     }
    // }

    var badges = []; 
    var membersCopy = [...members]; 
    //membersCopy.splice(0, 1);

    membersCopy.map(id => badges.push(createBadge(id, colorMemMapping, memberNameMapping)));

    return (
      <Row className="cal_row" class="h-20" >
        <Col sm={2}>
          <div className="cal_bottomtext"> Memories & Metrics: </div>
        </Col>
        <Col sm={4}>
        <ListGroup>
          <ListGroup.Item>Total Hours Spent: {total}</ListGroup.Item>
          <ListGroup.Item>Average Hrs/Week: {avg}</ListGroup.Item>
        </ListGroup>
        </Col>
        <Col sm={2}>
          <div className="cal_bottomtext"> Calendar & Legend: </div>
        </Col>
        <Col sm={4}>
            <ListGroup className="cal_listLegend"> 
                {badges}
            </ListGroup> 
        </Col>
      </Row>
    );
}

  export {
    miscStatistics,
    ChooseMeetingTImes,
    getScheduledMeetings,
  };
  