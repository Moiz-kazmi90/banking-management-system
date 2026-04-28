import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        const savedAdmin = localStorage.getItem("admin");

        if (savedToken) {
          setToken(savedToken);
          if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Auth init error:", err);
        localStorage.clear();
      } finally {
        // Loading ko hamesha end mein false karna hai
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const loginUser = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  const loginAdmin = (adminData, authToken) => {
    setAdmin(adminData);
    setToken(authToken);
    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("token", authToken);
    localStorage.removeItem("user");
    setUser(null);
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ 
      user, admin, token, loading, 
      loginUser, loginAdmin, logout,
      isUserLoggedIn: !!user, 
      isAdminLoggedIn: !!admin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);