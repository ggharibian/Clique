import { useEffect, useRef } from "react"

function Map(props){
    const ref = useRef(null);
    const style = {height: "100%"}
    useEffect((props) => {
        new window.google.maps.Map(ref.current, {
            center: {lat: 0, lng: 0},
            zoom: 4,
        });

    })

    return <div ref={ref} style={style} id="map"/>
}

export default Map