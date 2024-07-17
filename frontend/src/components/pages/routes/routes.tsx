import React from 'react';
import GetRoute from "../../common/route/getRoute";
import { NavBar } from '../../common/navbar/navbar';
import { Footer } from '../../common/footer/footer';

import { useLoadScript } from '@react-google-maps/api';

export function GetRoutes() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBjuOHiUYowOxJqrfPbTCsxjCGfYRCYM20",
        libraries: ["places"],
    });

    if (!isLoaded) {
        return <div>Loading... Please wait</div>
    }

    return (
        <>
            <NavBar />
            <GetRoute />
            <Footer />
        </>
    );
};

export default GetRoutes;