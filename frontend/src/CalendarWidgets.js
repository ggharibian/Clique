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
import Form from 'react-bootstrap/Form';
import Navbar from "./components/navbar";
import Badge from "react-bootstrap/Badge";
import Spinner from 'react-bootstrap/Spinner';


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

    console.log(event.StartTime)
    console.log(eventDate); 
    console.log(today); 

    if (eventDate > today) { nextEvents.push(accordion); }
    else { pastEvents.push(accordion); }

    console.log(i); 
  }

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

  function miscStatistics_expanded () {
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

  export {
    miscStatistics,
    ChooseMeetingTImes,
    getScheduledMeetings,
  };
  