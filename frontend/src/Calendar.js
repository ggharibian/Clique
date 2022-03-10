import React from "react";
import "./Calendar.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from "./components/navbar";

import {miscStatistics,ChooseMeetingTImes,getScheduledMeetings} from "./CalendarWidgets";
import calendarGoogle from "./CalendarGoogle";

/*
NEEDED FROM FIREBASE:
- Group ID of user's group
- Member ID's of group's members
- Calendar ID's of member's calendars
- Event ID's of all upcoming/past events
- Group Statistics (ex. # of meetups)
THINGS NEEDED TO POPULATE PAGE:
- All of member's calendars
- Algorithm to determine which times/days are free
- Populate upper-right widget with free days/times
- When user chooses times + clicks schedule -->
  o Create a new Event
  o Update all user's calendars with Event
  o Store that new Event ID in Firebase
*/

import { useEffect, useState } from "react";
import { auth, db, logout } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, getDoc, doc } from "firebase/firestore";
import checkPage from "./CheckPage";


// Returns: [group, name, user, avg, total, events, members, calendarIDs]

function GetIDs() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const navigate = useNavigate();

  const [avg, setAvg] = useState("");
  const [total, setTotal] = useState("");
  const [events, setEvents] = useState("");
  const [members, setMembers] = useState("");

  const [memberNames, setMemberNames] = useState([]); 
  const addMemberName = (id) => {
    setMemberNames((prev) => { 
      return [id, ...prev]; 
    })
  };

  const removeMemberNames = () => {
    setMemberNames(() => { return []; })
  };


  const [calendarIDs, setCalendarIDs] = useState([]);
  const addCalendarID = (id) => {
    setCalendarIDs((prev) => { 
      return [id, ...prev]; 
    })
  };

  const removeCalendarIDs = () => {
    setCalendarIDs(() => { return []; })
  };


  const [eventDescs, setEventDescs] = useState([]);
  const addEventDesc = (id) => {
    setEventDescs((prev) => { 
      return [id, ...prev]; 
    })
  };

  const removeEventDescs = () => {
    setEventDescs(() => { return []; })
  };
  


  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
      setGroup(data.groups); 

      const currGroup = String(data.groups[0]);

      try {
        const q = query(collection(db, "groups"), where("gid", "==", currGroup));
        const docRead = await getDocs(q);
        //console.log(currGroup);
        //docRead.forEach((doc) => {
        //  console.log(doc.id, " => ", doc.data());
        //});
        const data = docRead.docs[0].data();
        
        //console.log("Boutta set data"); 

        setAvg(data.AvgHangoutTimePerWeek);
        setTotal(data.TotalHoursSpentHangingOut); 
        setEvents(data.Events);
        setMembers(data.people);

        //console.log("Set member data"); 

        const member_ids = data.people; 
        const event_ids = data.Events; 
        removeCalendarIDs(); // We don't keep adding... lmao 
        removeMemberNames(); 
        removeEventDescs(); 

        //console.log("Boutta try next...");

        try {
          const q = query(collection(db, "users"), where("uid", "in", member_ids));
          const doc = await getDocs(q);
          for(var i = 0; i < doc.size; i++)
          {
            const data = doc.docs[i].data();
            //console.log(data); 
            addCalendarID(data.calendarID);
            addMemberName(data.name); 
          }

          //console.log(calendarIDs); 

        } catch (err) {
          console.error(err);
          alert("CALENDAR: An error occured while fetching calendar data");
        }

        try {
          const q = query(collection(db, "events"), where("eid", "in", event_ids));
          const doc = await getDocs(q);
          for(var i = 0; i < doc.size; i++)
          {
            const data = doc.docs[i].data();
            //console.log(data); 
            addEventDesc(data);
          }
        } catch (err) {
          console.error(err);
          alert("EVENTS: An error occured while fetching event data");
        }

        

      } catch (err) {
        console.error(err);
        alert("GROUP: An error occured while fetching group data");
      }
    } catch (err) {
      console.error(err);
      alert("USER: An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    checkPage(); 
    fetchUserName();
  }, [user, loading, checkPage]);

  return [group, name, user, avg, total, events, members, memberNames, calendarIDs, eventDescs]; 
}

// Test function that outputs given information: 

function HTMLdiv(group, name, user, members, events, avg, total, calendarIDs) {

  //console.log(calendarIDs); 

  return(
    <div>
      <Row> 
        <Col><p> Hello {group} {name} {user?.id} {members} {events} {avg} {total} Blop {calendarIDs} Pops </p></Col>
      </Row>
    </div>
  );
}


function getNextEvents() {
  return;
}

function getPastEvents() {
  return;
}

function getStatistics() {
  return;
}

function createDivNextEvents() {
  return;
}

function createDivPastEvents() {
  return;
}

function createDivStatistics() {

}


function Calendar() {

  var [group, name, user, avg, total, events, members, memberNames, calendarIDs, eventDescs] = GetIDs(); 
  var colorsList = ["#0198E1", "#3F9E4D", "#4B0082", "#55141C", "#8B0000", "#8B6508", "#8FD8D8", "#A2627A", "#C2C2C2", "#CD7F32"];
  var colorCalMapping = {}; 
  var colorMemMapping = {}; 
  var memberNameMapping = {}; 

  for (var i = 0; i < members.length; i++)
  {
    colorMemMapping[members[i]] = colorsList[i]; 
    colorCalMapping[calendarIDs[i]] = colorsList[i]; 
    memberNameMapping[members[i]] = memberNames[i]; 
  }

  //console.log(memberNameMapping); 
  //console.log(events); 
  //console.log(eventDescs); 
   
    return (
      <div>
        <Navbar/>
        <div className="calendar">
          <Row>
            <Col>
              <Card border="info" className="cal_widgetCard">
                  {calendarGoogle(calendarIDs, members, colorCalMapping, memberNameMapping)}
              </Card>

              <Card border="info" className="cal_funCard">
                  {miscStatistics(avg, total, events, members, colorMemMapping, memberNameMapping)}
              </Card>
            </Col>

            <Col>
              <Card border="info" className="cal_scheduleCard">
                  {ChooseMeetingTImes(group)}
              </Card>

              <Card border="info" className="cal_meetingCard scroll">
                  {getScheduledMeetings(eventDescs)}
              </Card>
            </Col>
          </Row>

        </div>
        </div>
    );
}

export default Calendar;