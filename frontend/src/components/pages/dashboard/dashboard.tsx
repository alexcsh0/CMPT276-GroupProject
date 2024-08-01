import React, { useEffect, useState } from 'react';
import style from './dashboard.module.css';
import { Accordion, AccordionSummary, Box, Paper, Typography } from '@mui/material';
import { NavBar } from '../../common/navbar/navbar';
import { Footer } from '../../common/footer/footer';
import axios from 'axios';
import AlertCard from '../../alerts/alertCard';
import { getApiUrl } from '../../../util/util';
import { useUser } from '../../common/user-context/user-context';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

  const [offAlerts, setOffAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.post(`${getApiUrl()}/api/alerts/offAlerts`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        console.log(response.data)
        setOffAlerts(response.data);
      } catch (error) {
        console.error("Error fetching alerts", error);
      }
    };

    fetchAlerts();
  }, [user?.token]);

  return (
    <>
      <NavBar />

      <div className={style.dashboardPage} data-testid="dashboard-page">
        <h3 data-testid="date">Today's Date: {new Date().toLocaleDateString()}</h3>
        <h3 data-testid="time">Current Time: {new Date().toLocaleTimeString()}</h3>

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
              maxWidth: 500,
              border: '1px solid black'
            }}
            data-testid="upcoming-buses"
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
              maxWidth: 500,
              border: '1px solid black'
            }}
            data-testid="upcoming-skytrains"
          >
            <Typography variant="h4" color="primary">
              Upcoming Skytrains
            </Typography>
            <Typography>No upcoming skytrains found.</Typography>
          </Paper>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems={'center'}
          marginTop={6}
        >
          <Paper
            style={{
              flex: 1,
              height: 600,
              minWidth: 1016,
              overflowY: 'auto',
              border: '1px solid black'
            }}
            data-testid="alerts-section"
          >
            <Typography variant="h4" color="primary">
              Alerts
            </Typography>
            <Accordion data-testid="custom-alerts-accordion">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>Custom Alerts</Typography>
              </AccordionSummary>

              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <AlertCard key={alert.id} {...alert} data-testid={`alert-card-${alert.id}`} />
                ))
              ) : (
                <Typography>No current alerts.</Typography>
              )}
            </Accordion>
            <Accordion data-testid="official-alerts-accordion">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>Official Alerts</Typography>
              </AccordionSummary>

              {offAlerts.length > 0 ? (
                offAlerts.map(alert => (
                  <AlertCard key={alert.title} {...alert} data-testid={`off-alert-card-${alert.id}`} />
                ))
              ) : (
                <Typography>No current official alerts.</Typography>
              )}
            </Accordion>
          </Paper>
        </Box>
      </div>
      <Footer />
    </>
  );
}

