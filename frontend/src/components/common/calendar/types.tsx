// src/types.ts

export interface User {
    id: number;
    name: string;
}

export interface Calendar {
    id: number;
    name: string;
    userId: number;
    events: Event[];
}

export interface Event {
    id: number;
    title: string;
    start: string; // or Date
    end: string; // or Date
    calendarId: number;
}
