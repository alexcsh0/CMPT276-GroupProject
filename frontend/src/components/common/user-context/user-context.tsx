import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getApiUrl } from '../../../util/util';

const tokenTitle = 'RouteAlert';

export enum UserTypes {
  User,
  Admin
};

export interface UserObject {
  token: string
  userType: UserTypes
};

interface UserContextType {
  user: UserObject | null
  login: (token: string, userType: UserTypes, rememberMe: boolean) => void
  logout: () => void
  loading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<UserObject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkExistingToken = async () => {
      const token = localStorage.getItem(tokenTitle);
      if (token) {
        await axios.post(`${getApiUrl()}/api/users/validate`, token)
          .then((response) => {
            if (response?.data?.userType !== undefined) {
              setUser({ token, userType: response.data.userType });
            }
          })
          .catch(() => {
            localStorage.removeItem(tokenTitle);
            setUser(null);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
    void checkExistingToken();
  }, []);

  const login = (token: string, userType: UserTypes, rememberMe: boolean) => {
    setUser({ token, userType });
    if (rememberMe) {
      localStorage.setItem(tokenTitle, token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(tokenTitle);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
