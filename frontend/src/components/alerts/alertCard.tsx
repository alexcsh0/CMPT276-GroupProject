import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface AlertProps {
    id: number;
    title: string;
    affectedService: string;
    message: string;
    createdAt: string;
}

const AlertCard: React.FC<AlertProps> = ({ title, affectedService, message, createdAt }) => (
    <Card style={{ margin: '10px', width: '100%' }}>
        <CardContent>
            <Typography variant="h6" color="primary">
                {title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Affected Service: {affectedService}
            </Typography>
            <Typography variant="body1">
                {message}
            </Typography>
            <Typography variant="caption" color="textSecondary">
                {new Date(createdAt).toLocaleString()}
            </Typography>
        </CardContent>
    </Card>
);

export default AlertCard;
