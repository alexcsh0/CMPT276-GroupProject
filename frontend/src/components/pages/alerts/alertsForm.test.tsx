import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertForm } from './alertsForm';
import { UserContext, UserTypes } from '../../common/user-context/user-context';
import { SnackbarContext } from '../../common/snackbar/snackbarContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

describe('AlertForm Component Tests', () => {
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

    it('renders the form fields correctly', () => {
        renderWithProviders(<AlertForm />);

        const titleField = screen.getByTestId('alert-title-input');
        expect(titleField).toBeInTheDocument();

        const affectedServiceField = screen.getByTestId('alert-affected-service-input');
        expect(affectedServiceField).toBeInTheDocument();

        const messageField = screen.getByTestId('alert-message-input');
        expect(messageField).toBeInTheDocument();

        const submitButton = screen.getByTestId('alert-submit-button');
        expect(submitButton).toBeInTheDocument();
    });

    it('enables the submit button when all fields are filled', () => {
        renderWithProviders(<AlertForm />);

        const titleField = screen.getByTestId('alert-title-input');
        const affectedServiceField = screen.getByTestId('alert-affected-service-input');
        const messageField = screen.getByTestId('alert-message-input');

        fireEvent.change(titleField, { target: { value: 'Test Title' } });
        fireEvent.change(affectedServiceField, { target: { value: 'Test Service' } });
        fireEvent.change(messageField, { target: { value: 'Test Message' } });

        const submitButton = screen.getByTestId('alert-submit-button');
        expect(submitButton).not.toBeDisabled();
    });

    it('disables the submit button when a field is empty', () => {
        renderWithProviders(<AlertForm />);

        const titleField = screen.getByTestId('alert-title-input');
        const affectedServiceField = screen.getByTestId('alert-affected-service-input');
        const messageField = screen.getByTestId('alert-message-input');

        fireEvent.change(titleField, { target: { value: 'Test Title' } });
        fireEvent.change(affectedServiceField, { target: { value: 'Test Service' } });

        const submitButton = screen.getByTestId('alert-submit-button');
        expect(submitButton).toBeDisabled();
    });

    it('displays loading indicator when submitting', async () => {
        renderWithProviders(<AlertForm />);

        const titleField = screen.getByTestId('alert-title-input');
        const affectedServiceField = screen.getByTestId('alert-affected-service-input');
        const messageField = screen.getByTestId('alert-message-input');
        const submitButton = screen.getByTestId('alert-submit-button');

        fireEvent.change(titleField, { target: { value: 'Test Title' } });
        fireEvent.change(affectedServiceField, { target: { value: 'Test Service' } });
        fireEvent.change(messageField, { target: { value: 'Test Message' } });

        fireEvent.click(submitButton);

        expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    });

    it('handles error during alert creation', async () => {
        axios.post = jest.fn().mockRejectedValue(new Error('Server error'));
        renderWithProviders(<AlertForm />);

        const titleField = screen.getByTestId('alert-title-input');
        const affectedServiceField = screen.getByTestId('alert-affected-service-input');
        const messageField = screen.getByTestId('alert-message-input');
        const submitButton = screen.getByTestId('alert-submit-button');

        fireEvent.change(titleField, { target: { value: 'Test Title' } });
        fireEvent.change(affectedServiceField, { target: { value: 'Test Service' } });
        fireEvent.change(messageField, { target: { value: 'Test Message' } });

        fireEvent.click(submitButton);

        expect(await screen.findByText('Sorry, there is an issue connecting to the server at the moment. Please try again later')).toBeInTheDocument();
    });
});
