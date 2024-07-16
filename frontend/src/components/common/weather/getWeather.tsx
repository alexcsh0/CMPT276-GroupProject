import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from '../../pages/dashboard/dashboard.module.css';
import { Box, Paper, Typography } from "@mui/material";

const Weather: React.FC = () => {
    const [vancouverWeather, setVancouverWeather] = useState<any>(null);
    const [burnabyWeather, setBurnabyWeather] = useState<any>(null);
    const [coquitlamWeather, setCoquitlamWeather] = useState<any>(null);
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
                const [vancouverResponse, burnabyResponse, coquitlamResponse, surreyResponse] = await Promise.all([
                    //vancouver
                    axios.get('https://api.open-meteo.com/v1/forecast?latitude=49.2664&longitude=-122.9526&current_weather=true'),
                    //burnaby
                    axios.get('https://api.open-meteo.com/v1/forecast?latitude=49.2827&longitude=-123.1207&current_weather=true'),
                    //coquitlam
                    axios.get('https://api.open-meteo.com/v1/forecast?latitude=49.2846&longitude=-122.7822&current_weather=true'),
                    //surrey
                    axios.get('https://api.open-meteo.com/v1/forecast?latitude=49.1063&longitude=-122.8251&current_weather=true')
                ]);

                setVancouverWeather(vancouverResponse.data.current_weather);
                setBurnabyWeather(burnabyResponse.data.current_weather);
                setCoquitlamWeather(coquitlamResponse.data.current_weather);
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
        return <div>Loading weather...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className={style.dashboardPage}>
                <h3>Today's Date: {new Date().toLocaleDateString()}</h3>
            </div>
            <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="center"
                gap={8}
                >
                <Paper
                    style={{
                    flex: 1,
                    height: 200,
                    minWidth: 500,
                    maxWidth: 500
                    }}
                >
                <Typography variant="h4" color="primary">
                Weather in Vancouver
                </Typography>
                <Typography variant = "h4" color = "black">
                Temperature: {vancouverWeather.temperature} °C
                </Typography>
                <Typography variant = "h4" color = "black">
                Weather: {weatherCodeDescriptions[vancouverWeather.weathercode]}
                </Typography>
                </Paper>

                <Paper
                    style={{
                    flex: 1,
                    height: 200,
                    minWidth: 500,
                    maxWidth: 500
                    }}
                >
                <Typography variant="h4" color="primary">
                Weather in Burnaby
                </Typography>
                <Typography variant = "h4" color = "black">
                Temperature: {burnabyWeather.temperature} °C
                </Typography>
                <Typography variant = "h4" color = "black">
                Weather: {weatherCodeDescriptions[burnabyWeather.weathercode]}
                </Typography>
                </Paper>

                <Paper
                    style={{
                    flex: 1,
                    height: 200,
                    minWidth: 500,
                    maxWidth: 500
                    }}
                >
                <Typography variant="h4" color="primary">
                Weather in Coquitlam
                </Typography>
                <Typography variant = "h4" color = "black">
                Temperature: {coquitlamWeather.temperature} °C
                </Typography>
                <Typography variant = "h4" color = "black">
                Weather: {weatherCodeDescriptions[coquitlamWeather.weathercode]}
                </Typography>
                </Paper>

                <Paper
                    style={{
                    flex: 1,
                    height: 200,
                    minWidth: 500,
                    maxWidth: 500
                    }}
                >
                <Typography variant="h4" color="primary">
                Weather in Surrey
                </Typography>
                <Typography variant = "h4" color = "black">
                Temperature: {surreyWeather.temperature} °C
                </Typography>
                <Typography variant = "h4" color = "black">
                Weather: {weatherCodeDescriptions[surreyWeather.weathercode]}
                </Typography>
                </Paper>
            </Box>
        </div>
    );
};

export default Weather;