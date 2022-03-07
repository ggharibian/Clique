import React from "react";
import "./Routing.css";
import Card from 'react-bootstrap/Card';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from "./components/Map";

function Routing() {

    const center = { lat: -25.363, lng: 131.044 }
    const zoom = 4
    
    return (
        <div className="routing">
            <div className="map">
            <Card style={{width: "50%", height: "85%", position: 'absolute', top: '10%', left: '3%'}}>
                <Card.Body>
                    <Map id="myMap" options={{center: {lat: 0, lng: 0}, zoom: 4}}
                    onMapLoad = {map => {
                        // var marker = new window.google.maps.Marker({
                        //     position: { lat: 0, lng: 0},
                        //     map: map,
                        //     title: 'WOWOWOW'
                        // });
                    }}/>
                </Card.Body>
            </Card>
            </div>
            <div className="trips">
                <Card style={{width: "40%", height: "41.75%", position: 'absolute', top: '10%', left: '55%'}}>
                    <Card.Body>
                    </Card.Body>
                </Card>
            </div>
            <div className="trips">
                <Card style={{width: "40%", height: "41.75%", position: 'absolute', top: '53.25%', left: '55%'}}>
                    <Card.Body>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default Routing;