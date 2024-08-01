import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavBar } from './navbar';
import { UserContext, UserTypes } from '../user-context/user-context';

describe('NavBar Component', () => {
    it('renders the home link and navigates to home', () => {
        render(
            <UserContext.Provider value={{ user: null, login: () => { }, logout: () => { }, loading: false }}>
                <NavBar />
            </UserContext.Provider>
        );

        const homeLink = screen.getByTestId('navbar-home-link');
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders user pages for non-admin users', () => {
        render(
            <UserContext.Provider value={{
                user: {
                    userType: UserTypes.User,
                    token: 'eyJhbG2c9j4c',
                    username: 'alex123'
                },
                login: () => { },
                logout: () => { },
                loading: false
            }}>
                <NavBar />
            </UserContext.Provider>
        );

        const calendarLink = screen.getByTestId('navbar-link-calendar');
        expect(calendarLink).toBeInTheDocument();
        expect(calendarLink).toHaveAttribute('href', '/calendar');

        const routesLink = screen.getByTestId('navbar-link-routes');
        expect(routesLink).toBeInTheDocument();
        expect(routesLink).toHaveAttribute('href', '/routes');
    });

    it('renders admin pages for admin users', () => {
        render(
            <UserContext.Provider value={{
                user: {
                    userType: UserTypes.Admin,
                    token: 'eyJhbG2c9j4c',
                    username: 'alex123'
                },
                login: () => { },
                logout: () => { },
                loading: false
            }}>
                <NavBar />
            </UserContext.Provider>
        );

        const alertsLink = screen.getByTestId('navbar-link-alerts');
        expect(alertsLink).toBeInTheDocument();
        expect(alertsLink).toHaveAttribute('href', '/alerts');

        const scheduleLink = screen.getByTestId('navbar-link-schedule');
        expect(scheduleLink).toBeInTheDocument();
        expect(scheduleLink).toHaveAttribute('href', '/schedule');
    });

    it('opens the user menu when the avatar is clicked', () => {
        render(
            <UserContext.Provider value={{
                user: {
                    userType: UserTypes.User,
                    token: 'eyJhbG2c9j4c',
                    username: 'alex123'
                },
                login: () => { },
                logout: () => { },
                loading: false
            }}>
                <NavBar />
            </UserContext.Provider>
        );

        const avatarButton = screen.getByTestId('navbar-avatar');
        fireEvent.click(avatarButton);

        const profileLink = screen.getByTestId('navbar-menuitem-profile');
        expect(profileLink).toBeInTheDocument();
    });

    it('renders login and signup links when not logged in', () => {
        render(
            <UserContext.Provider value={{
                user: null,
                login: () => { },
                logout: () => { },
                loading: false
            }}>
                <NavBar />
            </UserContext.Provider>
        );

        const loginLink = screen.getByTestId('navbar-login-link');
        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute('href', '/login');

        const registerLink = screen.getByTestId('navbar-register-link');
        expect(registerLink).toBeInTheDocument();
        expect(registerLink).toHaveAttribute('href', '/register');
    });
});
