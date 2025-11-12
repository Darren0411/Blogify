// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Base API URL from environment
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4500";

  // ✅ Global axios settings (used by all components)
  axios.defaults.baseURL = API_BASE;
  axios.defaults.withCredentials = true;

  // ✅ Function to fetch logged-in user details
  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get("/user/me");
      if (res.data?.success) setUser(res.data.user);
      else setUser(null);
    } catch (err) {
      setUser(null);
    }
  }, []);

  // ✅ Refresh user after login/logout
  const refreshUser = async () => {
    await fetchUser();
  };

  // ✅ Run once when app mounts
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchUser();
      setLoading(false);
    };
    init();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
