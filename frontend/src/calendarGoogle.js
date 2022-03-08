import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import "./Calendar.css";
import { listEvents } from "./firebase"

let styles = {
  //you can use object styles (no import required)
  calendar: {
    borderWidth: "0px", //make outer edge of calendar thicker
    width: "58vw", //  58vw
    height: "0vh", // 57vh
    marginTop: "-70px",
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

//
// en-gb.usa#holiday@group.v.calendar.google.com
function calendarGoogle (){
  //listEvents();
  const API_KEY = "AIzaSyBBXjmKJ2eYpb5W-haymBNm9N0Sfkx1wDM";
  const calendars = [
    {calendarId: "advit.deepak@gmail.com"},
  ];

  return (
    <div className="google_background">
      <Calendar apiKey={API_KEY} calendars={calendars} styles={styles} />
    </div>
  );
}

export default calendarGoogle;
