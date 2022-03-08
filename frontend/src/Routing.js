import React from "react";
import "./Routing.css";
import Card from 'react-bootstrap/Card';
import MyMap from "./components/Map";
import Navbar from "./components/navbar"

class Routing extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            map: <MyMap id="myMap" options={{center: {lat: 0, lng: 0}, zoom: 1}}
            onMapLoad = {map => {
                this.getAllMarkers(map)
            }}/>
        }
    }

    getAllMarkers(map){
        new window.google.maps.Marker({
                position: { lat: 0, lng: 0},
                map: map,
                title: 'WOWOWOW'
            })
    }

    render(){
        return (
            <div>
            <Navbar />
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
                        </Card.Body>
                    </Card>
                </div>
                <div className="Trips">
                    <Card style={{width: "40%", height: "41.75%", position: 'absolute', top: '53.25%', left: '55%'}}>
                        <Card.Body>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            </div>
        );
    }
    
    //For the friends list, let the user select which friends to hangout with. Also, make them select a location to hangout at.

    
}

export default Routing;