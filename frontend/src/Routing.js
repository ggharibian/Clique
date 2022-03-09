import React, { /*Component, useEffect, useState*/ } from "react";
import "./Routing.css";
import Card from 'react-bootstrap/Card';
import MyMap from "./components/Map";
import { db, /*auth*/ } from "./firebase";
import { /*useAuthState*/ } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { query, collection, getDocs, where,/*, doc, updateDoc, arrayUnion, getDoc*/ 
connectFirestoreEmulator} from "firebase/firestore";
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
            geocoder: new window.google.maps.Geocoder(),
            distanceMatrix: new window.google.maps.DistanceMatrixService(),
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
        this.state.distanceMatrix.getDistanceMatrix({
                origins: [from],
                destinations: [to],
                travelMode: 'DRIVING'
        }, (response, status) => {
            console.log('Distance Matrix Response: ', response.rows[0].elements[0].duration)
            console.log('Distance Matrix Status: ', status)
            return response.rows[0].elements

        })
    }

    getAllDrivers(index) {
        const people = this.state.events[index][0]
        // return people.filter( (item) => {return (item.licence === 'yes')})
        var result = []
        for (var i = 0; i < people.length; i++){
            if (people[i].license === 'yes'){
                result.push(people[i])
            }
        }
        return result
    }

    async getDistancesToAll(from, toAll){
        console.log(new Array(toAll.length).fill(from))
        console.log(toAll)
        return new Promise((resolve, reject) => {
            this.state.distanceMatrix.getDistanceMatrix({
                origins: new Array(toAll.length).fill(from),
                destinations: toAll,
                travelMode: 'DRIVING'
            }, (response, status) => {
                // console.log('Distance Matrix Response: ', response.rows[0].elements)
                // console.log('Distance Matrix Status: ', status)
                console.log('results:', response.rows.map((item) => {return item.elements[0].duration}))
                resolve(response.rows.map((item) => {return item.elements[0].duration}))
            })
        })
    }

    async getDistancesFromAll(fromAll, to){
        this.state.distanceMatrix.getDistanceMatrix({
            origins: fromAll,
            destinations: new Array(fromAll.length).fill(to),
            travelMode: 'DRIVING'
        }, (response, status) => {
                // console.log('Distance Matrix Response: ', response.rows[0].elements[0].duration)
                // console.log('Distance Matrix Status: ', status)

            return response.rows[0].elements
        })
    }

    convertPeopleToAddresses(people){
        var addresses = []
        for (var i = 0; i < people.length; i++){
            addresses.push(people[i].address)
        }
        return addresses
    }

    async getOrderingMatrix(drivers, nondrivers){
        return new Promise((resolve, reject) => {
            const ordermatrixpromises = new Array(drivers.length)

            for (var i = 0; i < drivers.length; i++){
                const e = i
                ordermatrixpromises[e] = this.getDistancesToAll(drivers[e].address, nondrivers.map((item) => {return item.address}))
            }

            Promise.all(ordermatrixpromises).then((values) => {
                resolve(values)
            })
        })
    }

    async updateEventIndex(index){
        if (index !== -1){
            this.setState({
                currentEventIndex: index
            })
                    // this.getDistancesToAll('10001 Lanark St. Sun Valley', ['330 De Neve Dr.', '8447 Yarrow St. Rosemead'])
            const drivers = this.getAllDrivers(index)
            const nondrivers = this.state.events[index][0].filter( (item) => {return (!drivers.includes(item))} )
            this.getOrderingMatrix(drivers, nondrivers).then((result) => {
                var matrix = result
                console.log('Matrix: ', matrix)
                this.updateMap(index)
            })
        }
    }

    getLatLngOfAddress(address){
        this.state.geocoder
        .geocode({address: address})
        .then((result) => {
            const { results } = result;
            return results[0].geometry.location
        })
        .catch((e) => {
            console.log("Geocode was not successful for the following reason: " + e);
            return {lat: null, lng: null}
        });
    }

    updateMap(index){
        this.setState({
            map: <MyMap id="myMap" options={{zoom: 12}}
            onMapLoad = {map => {
                for (var i = 0; i < this.state.events[index][0].length; i++){
                    const e = i
                    this.state.geocoder
                    .geocode({address: this.state.events[index][0][e].address})
                    .then((result) => {
                    
                    const marker = new window.google.maps.Marker({
                        map,
                        title: this.state.events[index][0][e].name + '\'s Address'
                    })
                    const { results } = result;
    
                    map.setCenter(results[0].geometry.location);
                    marker.setPosition(results[0].geometry.location);
                    marker.setMap(map);
                    })
                    .catch((e) => {
                    console.log("Geocode was not successful for the following reason: " + e);
                    });
                }

                
                // console.log('WHY?')
                // new window.google.maps.Marker({
                //     position: {lat: 80, lng: 80},
                //     map: map
                // })
                
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

        console.log('gids: ', gids)

        for (var i = 0; i < gids.length; i++){
            const gQuery = query(collection(db, "groups"), where("gid", "==", gids[i]))
            const getGroupDoc = await getDocs(gQuery)
            if (getGroupDoc.docs.length){
                var pids = getGroupDoc.docs[0].data().people
                var people = []
                console.log('pids: ', pids)

                for (var e = 0; e < pids.length; e++){
                    const pQuery = query(collection(db, "users"), where("uid", "==", pids[e]))
                    const getPeopleDoc = await getDocs(pQuery)
                    if (getPeopleDoc.docs.length){
                        people.push(getPeopleDoc.docs[0].data())
                    }
                }


                var eids = getGroupDoc.docs[0].data().Events
                console.log('eids: ', eids)
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
                                            <Button style={{width: "100%", paddingTop: "10px"}} variant="primary" size="lg" onClick={async () => { await this.updateEventIndex(index).then(()=>{console.log('yay we did it')}, () => {console.log('oh no')}) }}>
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