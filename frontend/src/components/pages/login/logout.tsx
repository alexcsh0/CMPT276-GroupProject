import React, { useEffect } from 'react';
import { useUser } from '../../common/user-context/user-context';
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from '../../common/snackbar/snackbarContext';;

export function Logout() {
  const user = useUser();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      user.logout();
      showSnackbar('Successfully logged out.');
      navigate('/');
    }
  }, [user, navigate]);

  return <div>Logging you out...</div>;
}
