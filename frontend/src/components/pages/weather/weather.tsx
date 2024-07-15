import React from 'react';
import Weather from '../../common/weather/getWeather';
import { NavBar } from '../../common/navbar/navbar';
import { Footer } from '../../common/footer/footer';

export function GetWeather() {
    return (
        <>
            <NavBar />
            <Weather />
            <Footer />
        </>
    );
};

export default GetWeather;