import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import "./Calendar.css";
import { listEvents } from "./firebase"

import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';

let styles = {
  //you can use object styles (no import required)
  calendar: {
    borderWidth: "0px", //make outer edge of calendar thicker
    width: "58vw", //  58vw
    height: "76vh", // 57vh
    marginTop: "0px",
    objectFit: "fit",
    padding: "-10px",
    opacity: "1.0",
    background: "rgba(120, 220, 0, 0)"
  },

  //you can also use emotion's string styles
  today: {
   /* highlight today by making the text red and giving it a red border */
    color: "red",
    border: "1px solid red",
  }
}

function randomColor() {

    return "#" + String(Math.floor(Math.random()*16777215).toString(16));
}

//
// en-gb.usa#holiday@group.v.calendar.google.com
function calendarGoogle (calendarIDs, members, colorCalMapping){
  //listEvents();
  const API_KEY = "AIzaSyBBXjmKJ2eYpb5W-haymBNm9N0Sfkx1wDM";

  const calendars2 = [
    {calendarId: "advit.deepak@gmail.com"},
  ];

  var calendars = [] 
  //console.log(colorCalMapping); 
  calendarIDs.map(element => calendars.push({calendarId: element, color: colorCalMapping[element]}));

  //console.log(calendarIDs)
  //calendars.splice(0, 1);
  //console.log(calendars);
  //console.log(calendars2);  

  if (calendars.length == 0)
  {
      return(
        <div className="spinner"> 
          <Spinner animation="border" height="200px" width="200px" />
        </div> 
      );
  }

  return (
    <div className="google_background">
      <Calendar apiKey={API_KEY} calendars={calendars} styles={styles} />
    </div>
  );
}

export default calendarGoogle;
