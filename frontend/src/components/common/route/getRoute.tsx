import { useState, useMemo, useRef, useEffect } from 'react';
import {
    Box, 
    Button,
    ButtonGroup,
    HStack,
    IconButton,
    Input,
    Text,
} from '@chakra-ui/react';
import Styles from './getRoute.module.css';
import {
    GoogleMap,
    DirectionsRenderer,
    Autocomplete,
} from '@react-google-maps/api';
import { VscChromeClose } from 'react-icons/vsc';
import { FaHome } from "react-icons/fa";


type latLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type Map = google.maps.Map;

export function GetRoute() { 

    const startingPosition = useMemo<latLngLiteral>(() => ({ lat: 49.18757324981386, lng: -122.84972643059662 }), []);
    const [map, setMap] = useState<Map | null>((null));
    const [directionsResponse, setDirectionsResponse] = useState<DirectionsResult | null>(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [amountOfRoutes, setRouteAmount] = useState('');
    const originRef = useRef<HTMLInputElement>(null);
    const destinationRef = useRef<HTMLInputElement>(null);
    
    async function calculateRoute() {
        if (originRef.current!.value === '' || destinationRef.current!.value === ' ') {
            return;
        } 
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: originRef.current!.value,
            destination: destinationRef.current!.value,
            travelMode: google.maps.TravelMode.TRANSIT,
            provideRouteAlternatives: true,
        });
        setDirectionsResponse(results);
        
        console.log(results.routes);
        setDistance(results.routes[0].legs[0].distance!.text);
        setDuration(results.routes[0].legs[0].duration!.text);
        setRouteAmount(results.routes.length.toString());
    }

    function displayRoute() {

        // work in progress
        for (let i = 0; i < Number(amountOfRoutes); i++) {
            console.log("hello");
        }
    }

    function clearRoute() {
        setDirectionsResponse(null);
        setDistance('');
        setDuration('');
        setRouteAmount('');
        originRef.current!.value = '';
        destinationRef.current!.value = '';
    }

    return <div className={Styles.container}>
        {/* Search Bar (Displayed on the left) */}
        <div className={Styles.searchBar}>
            <h1>Search</h1>
            <HStack spacing={2} justifyContent='space-between'>
                <Box flexGrow={1}>
                    <Autocomplete>
                        <Input type='text' placeholder='Origin' ref={originRef}/>
                    </Autocomplete>
                </Box>
                <Box flexGrow={1}>
                    <Autocomplete>
                        <Input type='text' placeholder='Destination' ref={destinationRef}/>
                    </Autocomplete>
                </Box>

                <ButtonGroup>
                    <Button type='submit'onClick={calculateRoute}>
                        Calculate Route
                    </Button>
                    <IconButton aria-label='center back' icon={<VscChromeClose />} onClick={clearRoute}/>
                </ButtonGroup>
            </HStack>

            <HStack spacing={2} justifyContent='space-between'>
                <Box flexGrow={1}>
                    <Text>Distance: {distance}</Text>
                    <Text>Duration: {duration}</Text>
                </Box>
                <IconButton aria-label='center back' icon={<FaHome />} onClick={() => {
                    map!.panTo(startingPosition)
                    map!.setZoom(17);
                }}/>
            </HStack>
            <h2>Alternative Routes: {amountOfRoutes}</h2>
            <ul>
                {/* work in progress */}
            </ul>
        </div>

        {/* Map (Displayed on the right) */}
        <div className={Styles.map}>
            <GoogleMap zoom={17} center={startingPosition} mapContainerClassName={Styles.mapContainer} onLoad={(map) => setMap(map)}>

                {directionsResponse && <DirectionsRenderer directions={directionsResponse}/>}
            </GoogleMap>
        </div>
    </div>;
}

export default GetRoute;