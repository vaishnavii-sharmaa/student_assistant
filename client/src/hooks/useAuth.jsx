import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('activeStudySessionId');
        localStorage.removeItem('activeStudySessionData');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginUser = (data) => {
    localStorage.removeItem('activeStudySessionId');
    localStorage.removeItem('activeStudySessionData');
    localStorage.setItem('token', data.token);
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      address: data.address,
      github: data.github,
      linkedin: data.linkedin,
      academicDetails: data.academicDetails,
      theme: data.theme,
      photo: data.photo,
      notificationPreferences: data.notificationPreferences,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeStudySessionId');
    localStorage.removeItem('activeStudySessionData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
