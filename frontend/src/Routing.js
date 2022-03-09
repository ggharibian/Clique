import React, { /*Component, useEffect, useState*/ } from "react";
import "./Routing.css";
import Card from 'react-bootstrap/Card';
import MyMap from "./components/Map";
import { db, /*auth*/ } from "./firebase";
import { /*useAuthState*/ } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { query, collection, getDocs, where/*, doc, updateDoc, arrayUnion, getDoc*/ } from "firebase/firestore";
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from "react-bootstrap/ListGroupItem";
import checkPage from "./CheckPage";
import Navbar from "./components/navbar"

// function getUsers(props){
//     useEffect(() => {
//         onSnapshot(collection(this.state.db, 'users'), () => {});
//     });
// }
class Routing extends React.Component {

    constructor(props){
        super(props)
        this.onScriptLoad = this.onScriptLoad.bind(this)

        this.state = {
            map: <MyMap id="myMap" options={{ zoom: 12 }}
            onMapLoad = {map => {
                this.getAllMarkers(map)
                // this.state.directionsDisplay.setMap(map)
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        };
                        map.setCenter(pos);
                      },
                      () => {
                      }
                    );
                  }
            }}/>,
            events: [],
            currentEventIndex: -1,
            adjacencyList: new Map()
        }
    }

    calculateRoute(from, to) {
        // var request = {
        //     origin: from,
        //     destination: to,
        //     travelMode: window.google.maps.TravelMode.DRIVING,
        //     unitSystem: window.google.maps.UnitSystem.IMPERIAL
        // }

        // this.state.directions.route(request, (result, status) => {
        //     if (status == window.google.maps.DirectionStatus.Ok){
        //         console.log(result)
        //     }
        // })
    }

    async updateDatabaseItems(){
        getAuth().onAuthStateChanged((user) => {
            if (user){
                this.updateStateWithAsync(user)
            }
        })
    }

    displayEventOnMap() {
        
    }

    distanceBetween(from, to){

    }

    routeChange(index){
        var newAdjacencyList = this.state.adjacencyList;
        newAdjacencyList.clear()
        // console.log('Index: ', this.state.currentEventIndex)
        // console.log('Events List: ', this.state.events[0])

        // for (var i = 0; i < this.state.events[index][0].length; i++){
        //     console.log(this.state.events[index][0][i])
        // }
    }

    updateEventIndex(index){
        if (index !== -1){
            this.setState({
                currentEventIndex: index
            })
            this.markNewPeople(index)
            this.routeChange(index)
        }
    }

    markNewPeople(index){

        this.setState({
            map: <MyMap id="myMap" options={{zoom: 12}}
            onMapLoad = {map => {
                for (var i = 0; i < this.state.events[index][0].length; i++){
                    console.log(this.state.events[index][0][i])
                }
            }}/>
        })
    }

    componentDidMount() {
        this.updateDatabaseItems()
        checkPage();
    }

    async updateStateWithAsync(user){
        const currentUserQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
        const getUserDoc = await getDocs(currentUserQuery);
        const userinfo = getUserDoc.docs[0].data()
        const gids = userinfo.groups
        var events = []

        for (var i = 0; i < gids.length; i++){
            const gQuery = query(collection(db, "groups"), where("gid", "==", gids[i]))
            const getGroupDoc = await getDocs(gQuery)
            if (getGroupDoc.docs.length){
                var pids = getGroupDoc.docs[0].data().people
                var people = []

                for (var e = 0; e < pids.length; e++){
                    const pQuery = query(collection(db, "users"), where("uid", "==", pids[e]))
                    const getPeopleDoc = await getDocs(pQuery)
                    people.push(getPeopleDoc.docs[0].data())
                }

                var eids = getGroupDoc.docs[0].data().Events
                for (e = 0; e < eids.length; e++){
                    const eQuery = query(collection(db, "events"), where("eid", "==", eids[e]))
                    const getEventDoc = await getDocs(eQuery)
                    events.push([people, getEventDoc.docs[0].data()])
                }
            }
        }

        this.setState({
            events: events
        })
    }

    onScriptLoad(){
        
    }

    getAllMarkers(map){
        
    }

    render(){
        return (
            <div>
            <Navbar />
            <div className="routing">
                <div className="map">
                <Card style={{width: "50%", height: "85%", position: 'absolute', top: '100px', left: '3%'}}>
                    <Card.Body style={{width: "100%", padding: 10}}>
                        {this.state.map}
                    </Card.Body>
                </Card>
                </div>
                <div className="Events">
                    <Card style={{width: "40%", height: /*"41.75%"*/ "85%", position: 'absolute', top: '100px', left: '55%'}}>
                        <Card.Body style={{overflow: "scroll"}}>
                            <div className="cal_regtext">Events</div>
                            <Accordion defaultActiveKey="3">
                                {/* <Modal> */}
                                { this.state.events.map((item, index) => {
                                    return <Accordion.Item>
                                        <Accordion.Header className={"Item " + String(index)}>
                                            {item[1].EventName}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ListGroup>
                                                <ListGroupItem>
                                                    Description: {item[1].EventDescription}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Destination Address: {item[1].LocAddress}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    Start Time: {item[1].StartTime}
                                                </ListGroupItem>
                                                <ListGroupItem>
                                                    End Time: {item[1].EndTime}
                                                </ListGroupItem>

                                            </ListGroup>
                                            
                                                {/* <l>
                                                    <li>
                                                        People Attending:
                                                        <ul>
                                                            {item[0].map((item) => {
                                                                return <li>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </li>
                                                </l> */}
                                            <Button style={{width: "100%", paddingTop: "10px"}} variant="primary" size="lg" onClick={() => { this.updateEventIndex(index) }}>
                                                View Your Pickup Route.
                                            </Button>

                                        </Accordion.Body>
                                    </Accordion.Item>
                                }) }
                                {/* </Modal> */}

                                {/* <Accordion.Item eventKey="3" className="upcoming">
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
                                </Accordion.Item> */}
                            </Accordion>
                        </Card.Body>
                    </Card>
                </div>
                {/* <div className="Trips">
                    <Card style={{width: "40%", height: "41.75%", position: 'absolute', top:  (window.screen.height * 0.4175 + 60), left: '55%'}}>
                        <Card.Body>
                            Should this card be here? I mean, the routes page only needs to display the information about
                            preexisting routes, so isn't that just composed of the events that the user has, and their corresponding
                            route (on the map)?
                        </Card.Body>
                    </Card>
                </div> */}
            </div>
            </div>
        );
    }
    
    //For the friends list, let the user select which friends to hangout with. Also, make them select a location to hangout at.

    
}

export default Routing;