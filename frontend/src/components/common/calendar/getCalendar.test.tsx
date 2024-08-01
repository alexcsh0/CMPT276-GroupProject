import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import PublicCalendar from './getCalendar';
import FullCalendar from '@fullcalendar/react';
import { UserContext, UserTypes } from '../user-context/user-context';
import { SnackbarContext } from '../../common/snackbar/snackbarContext';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('PublicCalendar Component Tests', () => {
    const mockUser = {
        token: 'test-token',
        userType: 'Admin',
        username: 'alex123',
    };

    const mockSnackbar = {
        showSnackbar: jest.fn()
    };

    const renderWithProviders = (ui: any) => {
        return render(
            <Router>
                <UserContext.Provider value={{
                    user: {
                        userType: UserTypes.User,
                        token: 'eyJhbG2c9j4c',
                        username: 'alex123'
                    },
                    login: jest.fn(),
                    logout: jest.fn(),
                    loading: false
                }}>
                    <SnackbarContext.Provider value={mockSnackbar}>
                        {ui}
                    </SnackbarContext.Provider>
                </UserContext.Provider>
            </Router>
        );
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        it('renders the calendar and event form', () => {
            renderWithProviders(<PublicCalendar />);

            const calendar = screen.getByTestId('full-calendar');
            expect(calendar).toBeInTheDocument();

            const titleInput = screen.getByTestId('event-title-input');
            expect(titleInput).toBeInTheDocument();

            const startDateInput = screen.getByTestId('event-start-input');
            expect(startDateInput).toBeInTheDocument();

            const endDateInput = screen.getByTestId('event-end-input');
            expect(endDateInput).toBeInTheDocument();

            const submitButton = screen.getByTestId('event-submit-button');
            expect(submitButton).toBeInTheDocument();
        });

        it('shows validation errors if required fields are empty', async () => {
            renderWithProviders(<PublicCalendar />);

            const submitButton = screen.getByTestId('event-submit-button');
            fireEvent.click(submitButton);

            expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
            expect(await screen.findByText(/start date is required/i)).toBeInTheDocument();
            expect(await screen.findByText(/end date is required/i)).toBeInTheDocument();
        });

        it('enables the submit button when all fields are filled', () => {
            renderWithProviders(<PublicCalendar />);

            const titleInput = screen.getByTestId('event-title-input');
            const startDateInput = screen.getByTestId('event-start-input');
            const endDateInput = screen.getByTestId('event-end-input');
            const submitButton = screen.getByTestId('event-submit-button');

            userEvent.type(titleInput, 'Test Event');
            userEvent.type(startDateInput, '2024-08-01');
            userEvent.type(endDateInput, '2024-08-02');

            expect(submitButton).not.toBeDisabled();
        });

        it('displays loading indicator when submitting', async () => {
            renderWithProviders(<PublicCalendar />);

            const titleInput = screen.getByTestId('event-title-input');
            const startDateInput = screen.getByTestId('event-start-input');
            const endDateInput = screen.getByTestId('event-end-input');
            const submitButton = screen.getByTestId('event-submit-button');

            userEvent.type(titleInput, 'Test Event');
            userEvent.type(startDateInput, '2024-08-01');
            userEvent.type(endDateInput, '2024-08-02');

            fireEvent.click(submitButton);

            expect(await screen.findByRole('progressbar')).toBeInTheDocument();
        });

        jest.mock('axios', () => ({
            post: jest.fn().mockResolvedValue({ data: {} })
        }));

        renderWithProviders(<PublicCalendar />);

        const titleInput = screen.getByTestId('event-title-input');
        const startDateInput = screen.getByTestId('event-start-input');
        const endDateInput = screen.getByTestId('event-end-input');
        const submitButton = screen.getByTestId('event-submit-button');

        userEvent.type(titleInput, 'Test Event');
        userEvent.type(startDateInput, '2024-08-01');
        userEvent.type(endDateInput, '2024-08-02');

        fireEvent.click(submitButton);

        expect(await screen.findByText('Event created successfully.')).toBeInTheDocument();
        expect(mockSnackbar.showSnackbar).toHaveBeenCalledWith('Event created successfully.');
    });

    it('handles error during event creation', async () => {
        (axios.post as jest.Mock).mockRejectedValue(new Error('Server error'));
        renderWithProviders(<PublicCalendar />);

        const titleInput = screen.getByTestId('event-title-input');
        const startDateInput = screen.getByTestId('event-start-input');
        const endDateInput = screen.getByTestId('event-end-input');
        const submitButton = screen.getByTestId('event-submit-button');

        userEvent.type(titleInput, 'Test Event');
        userEvent.type(startDateInput, '2024-08-01');
        userEvent.type(endDateInput, '2024-08-02');

        fireEvent.click(submitButton);

        expect(await screen.findByText(/error adding user event/i)).toBeInTheDocument();
    });
});
