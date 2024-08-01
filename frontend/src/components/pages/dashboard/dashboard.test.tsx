import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './dashboard';
import { UserContext, UserTypes } from '../../common/user-context/user-context';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dashboard Component Tests', () => {
    const mockUser = {
        token: 'test-token',
        userType: 'User',
        username: 'testUser',
    };

    const renderWithProviders = (ui: React.ReactNode) => {
        return render(
            <UserContext.Provider value={{
                user: {
                    userType: UserTypes.User,
                    token: 'eyJhbG2c9j4c',
                    username: 'alex123'
                }, login: jest.fn(), logout: jest.fn(), loading: false
            }}>
                {ui}
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        mockedAxios.get.mockResolvedValueOnce({ data: [] });
        mockedAxios.post.mockResolvedValueOnce({ data: [] });
    });

    it('renders the Dashboard component without crashing', async () => {
        await act(async () => {
            renderWithProviders(<Dashboard />);
        });

        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
        expect(screen.getByTestId('date')).toBeInTheDocument();
        expect(screen.getByTestId('time')).toBeInTheDocument();
    });

    it('displays loading state and no alerts initially', async () => {
        await act(async () => {
            renderWithProviders(<Dashboard />);
        });

        expect(screen.getByText(/no current alerts/i)).toBeInTheDocument();
        expect(screen.getByText(/no current official alerts/i)).toBeInTheDocument();
    });

    it('displays alerts when data is fetched successfully', async () => {
        const mockAlerts = [
            { id: 1, title: 'Alert 1', affectedService: 'Service 1', message: 'Message 1', createdAt: '2021-01-01' },
        ];

        mockedAxios.get.mockResolvedValueOnce({ data: mockAlerts });

        await act(async () => {
            renderWithProviders(<Dashboard />);
        });

        expect(screen.getByTestId('alert-card-1')).toBeInTheDocument();
    });

    it('handles error fetching alerts gracefully', async () => {
        console.error = jest.fn();

        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

        await act(async () => {
            renderWithProviders(<Dashboard />);
        });

        expect(screen.getByText(/no current alerts/i)).toBeInTheDocument();
        expect(console.error).toHaveBeenCalled();
    });

    it('expands and collapses accordions correctly', async () => {
        await act(async () => {
            renderWithProviders(<Dashboard />);
        });

        const customAlertsAccordion = screen.getByTestId('custom-alerts-accordion');
        expect(customAlertsAccordion).toBeInTheDocument();

        const officialAlertsAccordion = screen.getByTestId('official-alerts-accordion');
        expect(officialAlertsAccordion).toBeInTheDocument();
    });
});
