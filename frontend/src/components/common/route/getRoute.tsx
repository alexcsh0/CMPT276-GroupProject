import { useState, useMemo, useRef } from 'react';
import { Switch } from "@mui/material";
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
import { 
    FaHome,
} from "react-icons/fa";


type latLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type Map = google.maps.Map;

export function GetRoute() { 

    const startingPosition = useMemo<latLngLiteral>(() => ({ lat: 49.18757324981386, lng: -122.84972643059662 }), []);
    const [map, setMap] = useState<Map | null>((null));
    const [directionsResponse, setDirectionsResponse] = useState<DirectionsResult | null>(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const originRef = useRef<HTMLInputElement>(null);
    const destinationRef = useRef<HTMLInputElement>(null);
    const [checked, setChecked] = useState(false);
    const [shown, isShown] = useState(false);

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
        setDistance(results.routes[0].legs[0].distance!.text);
        setDuration(results.routes[0].legs[0].duration!.text);
        displayFirstRoute(results);
    }

    function displayFirstRoute(directionsResponse: google.maps.DirectionsResult) {

        if (!shown) {
            isShown(!shown);
            let parentNode = document.getElementById("firstRoute");
            let instructions = document.createElement("ol");
            let routeHeader = document.createElement("h3");
            routeHeader.innerHTML = "From " + directionsResponse?.routes[0].legs[0].departure_time?.text + " to " + directionsResponse?.routes[0].legs[0].arrival_time?.text + " ( " + directionsResponse?.routes[0].legs[0].duration?.text + " )";
            parentNode?.appendChild(routeHeader)
            let numberOfSteps = Number(directionsResponse?.routes[0].legs[0].steps.length);
            for (let i = 0; i < numberOfSteps; i++) {
                let step = document.createElement("li");
                step.innerHTML = (directionsResponse?.routes[0].legs[0].steps[i].instructions)!;
                instructions?.appendChild(step);
            }
            parentNode?.appendChild(instructions);
        }
    }

    function displayRoute() {

        setChecked(!checked);

        if (!checked) {
            let amountOfAltRoutes = Number(directionsResponse?.routes.length); // returns the number of possible routes (through transit only) available from point a to b
    
            for (let i = 1; i < amountOfAltRoutes; i++) {
                if (validateRoute(i)) {
    
                    let node = document.getElementById("transitRoutes");
                    let altRoute = document.createElement("li");
                    let instructions = document.createElement("ol");
                    let routeHeader = document.createElement("h2");
                    instructions.className = "instructions";
                    altRoute.className = "routes";
                    routeHeader.innerHTML = "From " + directionsResponse?.routes[i].legs[0].departure_time?.text + " to " + directionsResponse?.routes[i].legs[0].arrival_time?.text + " ( " + directionsResponse?.routes[i].legs[0].duration?.text + " )";

                    let numberOfSteps = Number(directionsResponse?.routes[i].legs[0].steps.length);
                    for (let j = 0; j < numberOfSteps; j++) {
                        let step = document.createElement("li");
                        step.innerHTML = (directionsResponse?.routes[i].legs[0].steps[j].instructions)!;
                        instructions.appendChild(step);
                    }
        
                    altRoute.appendChild(routeHeader);
                    altRoute.appendChild(instructions);
                    node?.appendChild(altRoute);
                }
            }
        }
        else {
            let altRoutes = document.getElementById("transitRoutes");
            altRoutes!.innerHTML = "";
        }
    }

    function validateRoute(i: number) {
       
        for (let j = i - 1; j >= 0; j--) {
            
            let currentRouteStepCount = Number(directionsResponse?.routes[i].legs[0].steps.length)
            let comparedRouteStepCount = Number(directionsResponse?.routes[j].legs[0].steps.length)
            let stepCount = currentRouteStepCount;
            if ( currentRouteStepCount < comparedRouteStepCount) {
                stepCount = comparedRouteStepCount;
            }

            for (let k = 0; k < stepCount; k++) {

                if (directionsResponse?.routes[i].legs[0].steps[k].instructions != directionsResponse?.routes[j].legs[0].steps[k].instructions) { 
                    return true;
                }
            }
        }
        return false;
    }

    function clearRoute() {
        isShown(!shown);
        let instructions = document.getElementById("firstRoute");
        instructions!.innerHTML = "";
        let altRoutes = document.getElementById("transitRoutes");
        altRoutes!.innerHTML = "";
        setDirectionsResponse(null);
        setDistance('');
        setDuration('');
        originRef.current!.value = '';
        destinationRef.current!.value = '';
    }

    return <div className={Styles.container}>
        {/* Search Bar (Displayed on the left) */}
        <div className={Styles.searchBar}>
            <h1>Search</h1>
            <HStack spacing={2} justifyContent='space-between' alignItems="initial">
                
                <div className={Styles.search}>
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

                    <ButtonGroup className={Styles.buttonGroup}>
                        <Button type='submit'onClick={calculateRoute}>
                            Calculate Route
                        </Button>
                        <IconButton aria-label='center back' icon={<VscChromeClose />} onClick={clearRoute}/>
                        <IconButton aria-label='center back' icon={<FaHome />} onClick={() => {
                            map!.panTo(startingPosition)
                            map!.setZoom(17);
                        }}/>
                    </ButtonGroup>
                </div>
                <aside className={Styles.steps}>
                    <h2>Instructions</h2>
                    <div id="firstRoute">

                    </div>
                </aside>
            </HStack>

            <HStack spacing={2} justifyContent='space-between'>
                <Box flexGrow={1}>
                    <Text>Distance: {distance}</Text>
                    <Text>Duration: {duration}</Text>
                </Box>
            </HStack>
            {/* <IconButton aria-label='center back' icon={<FaRoute fontSize={"large"} />} onClick={displayRoute}/> */}
            <h2>Show Alternative Routes :  
            
            <Switch checked={checked} onChange={displayRoute}/>
            
            </h2>
            <ol id="transitRoutes">
            </ol>
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