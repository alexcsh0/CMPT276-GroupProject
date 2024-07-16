import React, { useEffect, useState } from 'react';
import style from './dashboard.module.css';
import { Box, Paper, Typography } from '@mui/material';
import { NavBar } from '../../common/navbar/navbar';
import { Footer } from '../../common/footer/footer';
import axios from 'axios';
import AlertCard from '../../alerts/alertCard';
import { getApiUrl } from '../../../util/util';
import { useUser } from '../../common/user-context/user-context';

interface Alert {
  id: number;
  title: string;
  affectedService: string;
  message: string;
  createdAt: string;
}

export function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`${getApiUrl()}/api/alerts`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        setAlerts(response.data);
      } catch (error) {
        console.error("Error fetching alerts", error);
      }
    };

    fetchAlerts();
  }, [user?.token]);

  return (
    <>
      <NavBar />

      <div className={style.dashboardPage}>
        <h3>Today's Date: {new Date().toLocaleDateString()}</h3>
        <h3>Current Time: {new Date().toLocaleTimeString()}</h3>

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
              height: 600,
              minWidth: 375,
              maxWidth: 500
            }}
          >
            <Typography variant="h4" color="primary">
              Upcoming Busses
            </Typography>
            <Typography>No upcoming buses found.</Typography>
          </Paper>

          <Paper
            style={{
              flex: 1,
              height: 600,
              minWidth: 375,
              maxWidth: 500
            }}
          >
            <Typography variant="h4" color="primary">
              Upcoming Skytrains
            </Typography>
            <Typography>No upcoming skytrains found.</Typography>
          </Paper>

          <Paper
            style={{
              flex: 1,
              height: 600,
              minWidth: 375,
              maxWidth: 500,
              overflowY: 'auto'
            }}
          >
            <Typography variant="h4" color="primary">
              Alerts
            </Typography>
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <AlertCard key={alert.id} {...alert} />
              ))
            ) : (
              <Typography>No current alerts.</Typography>
            )}
          </Paper>
        </Box>
      </div>
      <Footer />
    </>
  );
}

