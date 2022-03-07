import React from "react";
import "./Routing.css";
import Card from 'react-bootstrap/Card';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from "./components/Map";

// import { Wrapper, Status } from "@googlemaps/react-wrapper";

// import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";

// function Map(){
//     return (
//         <GoogleMap 
//             defaultZoom={10} 
//             defaultCenter = {{lat: 45, lng: -75}}
//         />
//     );
// }

// const WrappedMap = withScriptjs(withGoogleMap(Map));

// class Map extends React.Component{
//     render(){
//         return <h1>Map</h1>;
//     }
// }

// const Map: React.FC<{}> = () => {
//     const ref = React.useRef<HTMLDivElement>(null);
//     const [map, setMap] = React.useState<google.maps.Map>();

//     React.useEffect(() => {
//     if (ref.current && !map) {
//         setMap(new window.google.maps.Map(ref.current, {}));
//     }
//     }, [ref, map]);

// };

function Routing() {

    const center = { lat: -25.363, lng: 131.044 }
    const zoom = 4
    
    return (
        <div className="routing">
            <div className="map">
            <Card style={{width: "50%", height: "85%", position: 'absolute', top: '10%', left: '3%'}}>
                <Card.Body>
                    <Wrapper apiKey={"AIzaSyBKwEuYU5RNf4DEi4DXyzoPibJwKwyqkkc"}>
                        <Map center={center} zoom={zoom}/>
                    </Wrapper>
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