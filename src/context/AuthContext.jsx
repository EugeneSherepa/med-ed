import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('accessToken'); 
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        const res = await api.get('/auth/me');
        setCurrentUser(res.data);
      } catch (err) {
        localStorage.removeItem('accessToken'); 
      } finally {
        setIsLoading(false); 
      }
    };
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};