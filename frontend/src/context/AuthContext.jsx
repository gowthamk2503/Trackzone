import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trackzone_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      const token = localStorage.getItem('trackzone_access_token');
      if (token) {
        try {
          const res = await userService.getProfile();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('trackzone_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, using stored local session');
        }
      }
      setIsLoading(false);
    };

    verifyUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data.success) {
        const { accessToken, refreshToken, user: loggedInUser } = res.data;
        localStorage.setItem('trackzone_access_token', accessToken);
        localStorage.setItem('trackzone_refresh_token', refreshToken);
        localStorage.setItem('trackzone_user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (data) => {
    try {
      const res = await authService.register(data);
      if (res.data.success) {
        const { accessToken, refreshToken, user: registeredUser } = res.data;
        localStorage.setItem('trackzone_access_token', accessToken);
        localStorage.setItem('trackzone_refresh_token', refreshToken);
        localStorage.setItem('trackzone_user', JSON.stringify(registeredUser));
        setUser(registeredUser);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please check your details.',
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('trackzone_access_token');
      localStorage.removeItem('trackzone_refresh_token');
      localStorage.removeItem('trackzone_user');
      setUser(null);
    }
  };

  const updateUserData = (updatedData) => {
    if (user) {
      const newUserData = { ...user, ...updatedData };
      setUser(newUserData);
      localStorage.setItem('trackzone_user', JSON.stringify(newUserData));
    }
  };

  const quickDemoLogin = async (role) => {
    if (role === 'admin') {
      await login('admin@trackzone.com', 'Admin@123');
    } else {
      await login('sarah.chen@trackzone.com', 'Employee@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        updateUserData,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
