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
            map: <MyMap id="myMap" options={{center: {lat: 0, lng: 0}, zoom: 1}}
            onMapLoad = {map => {
                this.getAllMarkers(map)
            }}/>,
            events: [],
            currentEventIndex: -1
        }
    }

    async updateDatabaseItems(){
        getAuth().onAuthStateChanged((user) => {
            if (user){
                this.updateStateWithAsync(user)
            }
        })
    }

    updateEventIndex(index){
        this.setState({
            currentEventIndex: index
        })
    }

    componentDidMount() {
        this.updateDatabaseItems()
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
            var eids = getGroupDoc.docs[0].data().Events
            for (var e = 0; e < eids.length; e++){
                const eQuery = query(collection(db, "events"), where("eid", "==", eids[e]))
                const getEventDoc = await getDocs(eQuery)
                events.push(getEventDoc.docs[0].data())
            }
        }

        this.setState({
            events: events
        })

        console.log(this.state.events[0])
    }

    onScriptLoad(){
        
    }

    getAllMarkers(map){
    }

    render(){
        console.log(this.state.currentEventIndex)
        return (
            <div className="routing">
                <div className="map">
                <Card style={{width: "50%", height: "85%", position: 'absolute', top: '10%', left: '3%'}}>
                    <Card.Body>
                        {this.state.map}
                    </Card.Body>
                </Card>
                </div>
                <div className="Friends">
                    <Card style={{width: "40%", height: "41.75%", position: 'absolute', top: '10%', left: '55%'}}>
                        <Card.Body>
                            <Accordion defaultActiveKey="3">
                                { this.state.events.map((item, index) => {
                                    console.log(item)
                                    return <Accordion.Item>
                                        <Accordion.Header className={"Item " + String(index)}>
                                            {item.EventName}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <l>
                                                <li>
                                                    Description: {item.EventDescription}
                                                </li>
                                                <li>
                                                    Destination Address: {item.LocAddress}
                                                </li>
                                                <li>
                                                    Start Time: {item.StartTime}
                                                </li>
                                                <li>
                                                    End Time: {item.EndTime}
                                                </li>
                                            </l>
                                            <Button variant="primary" size="lg" onClick={() => { this.updateEventIndex(index) }}>
                                                View Routes
                                            </Button>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                }) }

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
                <div className="Trips">
                    <Card style={{width: "40%", height: "41.75%", position: 'absolute', top: '53.25%', left: '55%'}}>
                        <Card.Body>
                            Should this card be here? I mean, the routes page only needs to display the information about
                            preexisting routes, so isn't that just composed of the events that the user has, and their corresponding
                            route (on the map)?
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
    
    //For the friends list, let the user select which friends to hangout with. Also, make them select a location to hangout at.

    
}

export default Routing;