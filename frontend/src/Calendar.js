import React from "react";
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
import Form from 'react-bootstrap/Form'

import calendarGoogle from "./calendarGoogle";

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
  o Remove that day from top widget, move to bottom

*/

import { auth, db, logout } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";

function getIDs() {
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

  // At this point, we have the user's ID

  // TODO: USING THIS USER ID --> NEED TO RETRIEVE
  // GROUP ID, MEMBER IDs, EVENT IDs, etc. For now,
  // this has all been hardcoded as shown below:

  var groupid = null; 
  return [user?.uid, groupid];


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


function getScheduledMeetings() {
  return (
    <div>
      <div className="cal_regtext"> Upcoming meetings: </div>
      <Accordion defaultActiveKey="3">

        <Accordion.Item eventKey="3" className="upcoming">
          <Accordion.Header className="upcoming">Mar 8 - Spring Break Road Trip</Accordion.Header>
          <Accordion.Body>
            Details: will be inserted/finalized shortly!
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Mar 16 - One Direction Concert</Accordion.Header>
          <Accordion.Body>
            Details: oh I wish this was a real thing...
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="cal_regtext"> Previous meetings: </div>
      <Accordion>
        <Accordion.Item eventKey="2" className="past">
          <Accordion.Header>Feb 24 - Westwood Dinner</Accordion.Header>
          <Accordion.Body>
            The night it all went wrong. The last time we saw him...
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className="past">
          <Accordion.Header>Feb 2 - Cancun Vacation</Accordion.Header>
          <Accordion.Body>
            Best trip ever. White sand, beach-front hotel. Ukeleles...
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="0" className="past">
          <Accordion.Header className="past">Jan 12 - Big Sur Trip</Accordion.Header>
          <Accordion.Body className="past">
            This is just filler for now. But Big Sur is amazing omfg.
          </Accordion.Body>
        </Accordion.Item>

      </Accordion>
    </div>
  );
}

function EventScheduler() {
  return(
    <div className="cal_form">
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>What's our next adventure?</Form.Label>
          <Form.Control type="text" placeholder="We'll sail off into the sunset..." />
          <Form.Text className="text-muted">
            Just a quick description so everyone know's what's up :)
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  );
}

function ChooseMeetingTImes() {
  return(
    <div>
      <div className="cal_regtext"> Available Days: </div>
      <Accordion defaultActiveKey="3">
        <Accordion.Item eventKey="3">
          <Accordion.Header>Mar 4</Accordion.Header>
          <Accordion.Body>
            <Row width="10vw">
              <Col sm={9}>
                <TimeRange
                    startMoment="8:00"
                    endMoment="9:00"
                    minuteIncrement="15"
                    onChange={React.returnFunction}
                />
              </Col>
              <Col sm={2}>
              <Button variant="success">Schedule</Button>{' '}
              </Col>
            </Row>
            {EventScheduler()}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Mar 8</Accordion.Header>
          <Accordion.Body>
          <Row width="10vw">
            <Col sm={9}>
              <TimeRange
                  startMoment="12:00"
                  endMoment="5:00"
                  minuteIncrement="15"
                  onChange={React.returnFunction}
              />
            </Col>
            <Col sm={2}>
            <Button variant="success">Schedule</Button>{' '}
            </Col>
          </Row>
          {EventScheduler()}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </div>
  );
}

function getCarousel(){
  return(
    <div>

    </div>
  );
}

function miscStatistics() {
  return (
    <Row className="cal_row" class="h-20" >
      <Col sm={2}>
        <div className="cal_bottomtext"> Memories & Metrics: </div>
      </Col>
      <Col sm={4}>
      <ListGroup>
        <ListGroup.Item>Total Hours Spent: 243</ListGroup.Item>
        <ListGroup.Item>Average Hrs/Week: 2.64</ListGroup.Item>
        <ListGroup.Item>Clique Ranking: 1205th</ListGroup.Item>
      </ListGroup>
      </Col>
      <Col sm={2}>
        <div className="cal_bottomtext"> Surprising Statistics: </div>
      </Col>
      <Col sm={4}>
      <ListGroup>
        <ListGroup.Item>Always Busy: Garni</ListGroup.Item>
        <ListGroup.Item>Always Free: Stephanie</ListGroup.Item>
        <ListGroup.Item>Most Hyped: Selina</ListGroup.Item>
      </ListGroup>
      </Col>
    </Row>
  );
}

function Calendar() {

    return (
        <div className="calendar">

          <Row>
            <Col>
              <Card border="info" className="cal_widgetCard">
                  {calendarGoogle()}
              </Card>

              <Card border="info" className="cal_funCard">
                  {miscStatistics()}
              </Card>
            </Col>

            <Col>
              <Card border="info" className="cal_meetingCard scroll">
                  {ChooseMeetingTImes()}
              </Card>

              <Card border="info" className="cal_scheduleCard">
                  {getScheduledMeetings()}
              </Card>
            </Col>
          </Row>

        </div>
    );
}

export default Calendar;
