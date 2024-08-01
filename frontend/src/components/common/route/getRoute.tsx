import React from 'react';
import { useState, useMemo, useRef } from 'react';
import axios from 'axios';
import ky from 'ky';
import { Switch, CircularProgress } from "@mui/material";
import {
    Box,
    Button,
    ButtonGroup,
    HStack,
    IconButton,
    Input,
    Text,
} from '@chakra-ui/react';
import {
    getApiUrl,
    getHandleChange,
    getCheckboxChange
  } from '../../../util/util';
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
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../common/user-context/user-context';
import { Success } from '../../pages/routes/success'


type latLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type Map = google.maps.Map;

export function GetRoute() { 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const startingPosition = useMemo<latLngLiteral>(() => ({ lat: 49.18757324981386, lng: -122.84972643059662 }), []);
    const [map, setMap] = useState<Map | null>((null));
    const [directionsResponse, setDirectionsResponse] = useState<DirectionsResult | null>(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const originRef = useRef<HTMLInputElement>(null);
    const destinationRef = useRef<HTMLInputElement>(null);
    const [checked, setChecked] = useState(false);
    const [checkedSavedRoutes, setCheckedSavedRoutes] = useState(false);
    const [shown, isShown] = useState(false);

    const { user } = useUser();
    let username: string | null = null;
    if (user) {
        username = user.username;
    } else {
        username = null;
    }

    const handleSaveRoute = async () => {
        const origin = originRef.current?.value;
        const destination = destinationRef.current?.value;

        if (!(origin) || !(destination)) {
            setError('All fields must be completed');
            console.log(error);
            return;
        }

        if (loading) return;
        setLoading(true);

        console.log(origin);
        console.log(destination);

        // Step 0: Check if logged in
        try {
            if (username == null) throw error;
            // Step 1: Add route to database if database does not contain route
            await axios.post(`${getApiUrl()}/api/routes/addRoute`, {
                origin,
                destination
            }, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            }).then((response) => {
                console.log(response.data);
                const { routeId } = response.data;
                
                // Step 2: Link relation between route and user table, and save the route on current account
                try {
                    axios.post(`${getApiUrl()}/api/users/saveRoute/{username}/{routeId}`, {
                        headers: {
                            'Authorization': `Bearer ${user?.token}`
                        }
                    });
                    // Step 3: Show success page
                    <Success />
                    navigate('/success');

                } catch (error) {
                    setError('Error: Unable to save this route to your account');
                }
            });
        } catch (error) {
            if (username == null) {
                setError('log in to save routes');
                console.log(error);
            } else {
                setError('Invalid origin or destination');
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    }

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

    const handleDisplayEvent = async() => {
        setCheckedSavedRoutes(!checkedSavedRoutes);

        try {
            if (username == null) throw error;
            if (!checkedSavedRoutes) {
                // Get number of saved routes
                let amountOfSavedRoutes = 0;
                await axios.get(`${getApiUrl()}/api/users/getRoutesAmount/{username}`, {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    }
                }).then((response) => {
                    window.location.reload()
                    const [ amount ] = response.data;
                    amountOfSavedRoutes = amount;
                })
                console.log(amountOfSavedRoutes + "Routes");
                // In a for loop, get each route and display on route page
                let origin: string = "";
                let destination: string = "";
                for (let i = 0; i < amountOfSavedRoutes; i++) {
                    await axios.post(`${getApiUrl()}/api/users/getRoutesOrigin/{username}/{i}`, {
                        headers: {
                            'Authorization': `Bearer ${user?.token}`
                        }
                    }).then((response) => {
                        const [ routeOrigin ] = response.data;
                        origin = routeOrigin;
                    });
                    await axios.post(`${getApiUrl()}/api/users/getRoutesDestination/{username}/{i}`, {
                        headers: {
                            'Authorization': `Bearer ${user?.token}`
                        }
                    }).then((response) => {
                        const [ routeDestination ] = response.data;
                        destination = routeDestination;
                    })
                    showSavedRoutes(origin, destination, i);
                }
            }
            else {
                let savedRoutes = document.getElementById("savedRoutes");
                savedRoutes!.innerHTML = "";
            }
        } catch (error) {
            if (username == null) {
                setError('log in to see saved routes');
                console.log(error);
            } else {
                setError('Error');
                console.log(error);
            }
        }
    }

     async function showSavedRoutes(origin: string, destination: string, i: number) {
        let node = document.getElementById("savedRoutes");
        let savedRoute = document.createElement("li");
        let subHeading = document.createElement("ol");
        let routeHeader = document.createElement("h2");
        subHeading.className = "subHeading";
        savedRoute.className = "savedRoute";
        routeHeader.innerHTML = "Route " + (i + 1);
        let originList = document.createElement("li");
        originList.innerHTML = origin;
        subHeading.appendChild(originList);

        let destinationList = document.createElement("li");
        destinationList.innerHTML = destination!;
        subHeading.appendChild(destinationList);

        savedRoute.appendChild(routeHeader);
        savedRoute.appendChild(subHeading);
        node?.appendChild(savedRoute);

        let loadButton = document.createElement("Button");
        loadButton.innerHTML = "Load";
        routeHeader.appendChild(loadButton);
        loadButton.onclick = async function() {
            if (origin === '' || destination === ' ') {
                return;
            } 
            const directionsService = new google.maps.DirectionsService();
            const results = await directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.TRANSIT,
                provideRouteAlternatives: true,
            });
    
            setDirectionsResponse(results);
            setDistance(results.routes[0].legs[0].distance!.text);
            setDuration(results.routes[0].legs[0].duration!.text);
            displayFirstRoute(results);
        }

        let deleteButton = document.createElement("Button");
        deleteButton.innerHTML = "Delete";
        routeHeader.appendChild(deleteButton);
        deleteButton.onclick = async function() {
            await axios.delete(`${getApiUrl()}/api/users/deleteRoute/{username}/{origin}/{destination}`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            }).then((response) => {
                const [ message ] = response.data;
                console.log(message);
            })
            savedRoute!.innerHTML = "";
        }
    }

    function validateRoute(i: number) {
        for (let j = i - 1; j >= 0; j--) {
            let currentRouteStepCount = Number(directionsResponse?.routes[i].legs[0].steps.length)
            let comparedRouteStepCount = Number(directionsResponse?.routes[j].legs[0].steps.length)
            let stepCount = currentRouteStepCount;
            if (currentRouteStepCount < comparedRouteStepCount) {
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
        let savedRoutes = document.getElementById("savedRoutes");
        savedRoutes!.innerHTML = "";
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
                            <Input type='text' placeholder='Origin' ref={originRef} data-testid="origin-input" />
                        </Autocomplete>
                    </Box>
                    <Box flexGrow={1}>
                        <Autocomplete>
                            <Input type='text' placeholder='Destination' ref={destinationRef} data-testid="destination-input" />
                        </Autocomplete>
                    </Box>

                    <ButtonGroup className={Styles.buttonGroup}>
                        <Button type='submit' onClick={calculateRoute} data-testid="calculate-route-button">
                            Calculate Route
                        </Button>
                        <IconButton aria-label='center back' icon={<VscChromeClose />} onClick={clearRoute} data-testid="clear-route-button" />
                        <IconButton aria-label='center back' icon={<FaHome />} onClick={() => {
                            map!.panTo(startingPosition)
                            map!.setZoom(17);
                        }} data-testid="home-button" />
                        <Button onClick={handleSaveRoute} variant="contained" disabled={loading || !(originRef.current?.value) || !(destinationRef.current?.value)}> 
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save'}
                        </Button>
                    </ButtonGroup>
                </div>
                <aside className={Styles.steps}>
                    <h2 className={Styles.stepTitle}>Instructions</h2>
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
            <div>
                <h2> Saved Routes 
                    <Switch checked={checkedSavedRoutes} onChange={handleDisplayEvent}/>
                </h2>
                <ol id="savedRoutes">
                </ol>
            </div>
            <div>
                <h2>Show Alternative Routes :  
                    <Switch checked={checked} onChange={displayRoute}/>
                </h2>
                <ol id="transitRoutes">
                </ol>
            </div>
        </div>

        {/* Map (Displayed on the right) */}
        <div className={Styles.map}>
            <GoogleMap zoom={17} center={startingPosition} mapContainerClassName={Styles.mapContainer} onLoad={(map) => setMap(map)}>

                {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
            </GoogleMap>
        </div>
    </div>;
}
export default GetRoute;