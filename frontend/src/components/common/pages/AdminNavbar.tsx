import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const AdminNavbar = () => {
    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton size='large' edge='start' color="inherit" aria-label="logo">
                    <AccountCircleIcon />
                </IconButton>
                <Typography variant="h6" component='div'>
                    Transit App
                </Typography>
            </Toolbar>

        </AppBar>
    )
}

export default AdminNavbar;