import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';

interface SnackbarContextType {
    showSnackbar: (message: string) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function useSnackbar() {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [snackbarState, setSnackbarState] = useState<{ open: boolean; message: string }>({
        open: false,
        message: '',
    });

    const showSnackbar = (message: string) => {
        setSnackbarState({ open: true, message });
    };

    const handleClose = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={snackbarState.open}
                onClose={handleClose}
                message={snackbarState.message}
                autoHideDuration={2000}
            />
        </SnackbarContext.Provider>
    );
};
