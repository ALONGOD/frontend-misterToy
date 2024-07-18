import React, { useState } from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export function GoogleMap() {
    const [coords, setCoords] = useState({ lat: 32.0853, lng: 34.7818 });
    const zoom = 11;

    function onHandleClick({ lat, lng }) {
        setCoords({ lat, lng });
    }

    // Function to set coordinates based on location name
    function setLocation(lat, lng) {
        setCoords({ lat, lng });
    }

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "" }} // Replace with your Google Maps API key
                defaultCenter={coords}
                defaultZoom={zoom}
                onClick={onHandleClick}
            >
                <AnyReactComponent
                    lat={coords.lat}
                    lng={coords.lng}
                    text="💖"
                />
            </GoogleMapReact>

            {/* Buttons to set different locations */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: '100' }}>
                <button onClick={() => setLocation(32.0853, 34.7818)}>Tel Aviv</button>
                <button onClick={() => setLocation(32.4338, 34.9179)}>Hadera</button>
                <button onClick={() => setLocation(32.0238, 34.7501)}>Bat Yam</button>
            </div>
        </div>
    );
}
