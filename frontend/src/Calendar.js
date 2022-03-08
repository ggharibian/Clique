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
import Navbar from "./components/navbar"


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

function ChooseMeetingTImes() {
  return(
    <div>
      <div className="cal_regtext"> Available Days: </div>
      <Accordion>
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
      <div>
        <Navbar />
        <div className="calendar">
          <Row>
            <Col>
              <Card border="info" className="cal_widgetCard">
                  // Todo: Add Calendar widget here!
              </Card>

              <Card border="info" className="cal_funCard">
                  {miscStatistics()}
              </Card>
            </Col>

            <Col>
              <Card border="info" className="cal_meetingCard scroll">
                  {getScheduledMeetings()}
              </Card>

              <Card border="info" className="cal_scheduleCard">
                  {ChooseMeetingTImes()}
              </Card>
            </Col>
          </Row>

        </div>
      </div>
        
    );
}

export default Calendar;