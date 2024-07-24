import React, { useState } from "react";
import GoogleMapReact from 'google-map-react';
import { Button, Box } from '@mui/material';

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
        <div >
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
            <div style={{ position: 'absolute', top: '30px', left: '170px', zIndex: '100' }}>
                <Box display="flex" flexDirection="column" gap="5px">
                    <Button variant="contained" onClick={() => setLocation(32.0853, 34.7818)}>Tel Aviv</Button>
                    <Button variant="contained" onClick={() => setLocation(32.4338, 34.9179)}>Hadera</Button>
                    <Button variant="contained" onClick={() => setLocation(32.0238, 34.7501)}>Bat Yam</Button>
                </Box>
            </div>
        </div>
    );
}
