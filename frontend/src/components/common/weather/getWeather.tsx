import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from '../../pages/dashboard/dashboard.module.css';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Weather: React.FC = () => {
    const [vancouverHourly, setVancouverHourly] = useState<any>(null);
    const [vancouverWeather, setVancouverWeather] = useState<any>(null);
    const [burnabyHourly, setBurnabyHourly] = useState<any>(null);
    const [burnabyWeather, setBurnabyWeather] = useState<any>(null);
    const [coquitlamHourly, setCoquitlamHourly] = useState<any>(null);
    const [coquitlamWeather, setCoquitlamWeather] = useState<any>(null);
    const [surreyHourly, setSurreyHourly] = useState<any>(null);
    const [surreyWeather, setSurreyWeather] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Weather code descriptions
    const weatherCodeDescriptions: { [key: string]: string } = {
        0: 'Clear Sky',
        1: 'Mainly CLear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing Rime Fog',
        51: 'Light Drizzle',
        53: 'Moderate Drizzle',
        55: 'Heavy Drizzle',
        56: 'Light Freezing Drizzle',
        57: 'Heavy Freezing Drizzle',
        61: 'Light Rain',
        63: 'Rain',
        65: 'Heavy Rain',
        66: 'Light Freezing Rain',
        67: 'Heavy Freezing Rain',
        71: 'Light Snowfall',
        73: 'Moderate Snowfall',
        75: 'Heavy Snowfall',
        77: 'Snow Grains',
        80: 'Slight Rain Showers',
        81: 'Moderate Rain Showers',
        82: 'Heavy Rain Showers',
        85: 'Slight Snow Showers',
        86: 'Moderate Snow Showers',
        95: 'Thunderstorm',
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                //get weather data for vancouver, burnaby, coquitlam, and surrey
                const [vancouverResponse, burnabyResponse, coquitlamResponse, surreyResponse] = await Promise.all([
                    //vancouver
                    axios.get('https://api.open-meteo.com/v1/forecast?latitude=49.2664&longitude=-122.9526&hourly=temperature_2m&current_weather=true'),
                    //burnaby
                    axios.get('https://api.open-meteo.com/v1/forecast?latitude=49.2827&longitude=-123.1207&hourly=temperature_2m&current_weather=true'),
                    //coquitlam
                    axios.get('https://api.open-meteo.com/v1/forecast?latitude=49.2846&longitude=-122.7822&hourly=temperature_2m&current_weather=true'),
                    //surrey
                    axios.get('https://api.open-meteo.com/v1/forecast?latitude=49.1063&longitude=-122.8251&hourly=temperature_2m&current_weather=true')
                ]);

                //get current hour
                const currentHour = new Date().getHours() + 7;

                //set hourly weather data for vancouver
                const vancouverHourly = vancouverResponse.data.hourly;
                const vancouver12Hours = vancouverHourly.time
                    .map((time: string, index: number) => ({
                        time,
                        temperature: vancouverHourly.temperature_2m[index],
                    })).slice(currentHour, currentHour + 12);

                //set hourly weather data for burnaby
                const burnabyHourly = burnabyResponse.data.hourly;
                const burnaby12Hours = burnabyHourly.time
                    .map((time: string, index: number) => ({
                        time,
                        temperature: burnabyHourly.temperature_2m[index],
                    })).slice(currentHour, currentHour + 12);

                //set hourly weather data for coquitlam
                const coquitlamHourly = coquitlamResponse.data.hourly;
                const coquitlam12Hours = coquitlamHourly.time
                    .map((time: string, index: number) => ({
                        time,
                        temperature: coquitlamHourly.temperature_2m[index],
                    })).slice(currentHour, currentHour + 12);

                //set hourly weather data for surrey
                const surreyHourly = surreyResponse.data.hourly;
                const surrey12Hours = surreyHourly.time
                    .map((time: string, index: number) => ({
                        time,
                        temperature: surreyHourly.temperature_2m[index],
                    })).slice(currentHour, currentHour + 12);

                setVancouverHourly(vancouver12Hours);
                setVancouverWeather(vancouverResponse.data.current_weather);
                setBurnabyHourly(burnaby12Hours);
                setBurnabyWeather(burnabyResponse.data.current_weather);
                setCoquitlamHourly(coquitlam12Hours);
                setCoquitlamWeather(coquitlamResponse.data.current_weather);
                setSurreyHourly(surrey12Hours);
                setSurreyWeather(surreyResponse.data.current_weather);
            } catch (error) {
                setError('Error fetching weather data');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return <div>Loading Weather...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    //get labels and temperatures for vancouver line chart
    const vancouverLabel = vancouverHourly.map((weather: any) => new Date(weather.time)
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const vancouverTemps = vancouverHourly.map((weather: any) => weather.temperature);

    //get labels and temperatures for burnaby line chart
    const burnabyLabel = burnabyHourly.map((weather: any) => new Date(weather.time)
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const burnabyTemps = burnabyHourly.map((weather: any) => weather.temperature);

    //get labels and temperatures for coquitlam line chart
    const coquitlamLabel = coquitlamHourly.map((weather: any) => new Date(weather.time)
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const coquitlamTemps = coquitlamHourly.map((weather: any) => weather.temperature);

    //get labels and temperatures for surrey line chart
    const surreyLabel = surreyHourly.map((weather: any) => new Date(weather.time)
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const surreyTemps = surreyHourly.map((weather: any) => weather.temperature);

    return (
        <div>
            <div className={style.dashboardPage}>
                <h3>Today's Date: {new Date().toLocaleDateString()}</h3>
                <h3>Current Time: {new Date().toLocaleTimeString()}</h3>
            </div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    Vancouver:
                    <br />
                    Temperature: {vancouverWeather.temperature} °C
                    <br />
                    Weather: {weatherCodeDescriptions[vancouverWeather.weathercode]}
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <LineChart
                            xAxis={[
                                {
                                    data: vancouverLabel,
                                    scaleType: 'point',
                                },
                            ]}
                            series={[
                                {
                                    data: vancouverTemps,
                                    label: 'Vancouver Weather (°C) for the next 12 hours',
                                },
                            ]}
                            height={400}
                            width={800}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    Burnaby:
                    <br />
                    Temperature: {burnabyWeather.temperature} °C
                    <br />
                    Weather: {weatherCodeDescriptions[burnabyWeather.weathercode]}
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <LineChart
                            xAxis={[
                                {
                                    data: burnabyLabel,
                                    scaleType: 'point',
                                },
                            ]}
                            series={[
                                {
                                    data: burnabyTemps,
                                    label: 'Burnaby Weather (°C)',
                                },
                            ]}
                            height={400}
                            width={800}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    Coquitlam:
                    <br />
                    Temperature: {coquitlamWeather.temperature} °C
                    <br />
                    Weather: {weatherCodeDescriptions[coquitlamWeather.weathercode]}
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <LineChart
                            xAxis={[
                                {
                                    data: coquitlamLabel,
                                    scaleType: 'point',
                                },
                            ]}
                            series={[
                                {
                                    data: coquitlamTemps,
                                    label: 'Coquitlam Weather (°C)',
                                },
                            ]}
                            height={400}
                            width={800}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4a-content"
                    id="panel4a-header"
                >
                    Surrey:
                    <br />
                    Temperature: {surreyWeather.temperature} °C
                    <br />
                    Weather: {weatherCodeDescriptions[coquitlamWeather.weathercode]}
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <LineChart
                            xAxis={[
                                {
                                    data: surreyLabel,
                                    scaleType: 'point',
                                },
                            ]}
                            series={[
                                {
                                    data: surreyTemps,
                                    label: 'Surrey Weather (°C)',
                                },
                            ]}
                            height={400}
                            width={800}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default Weather;