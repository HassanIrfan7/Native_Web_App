import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BACKEND_URL } from "../config";
import { publicApi, authApi } from "../services/api.service";

interface User {
  id: number | string;
  username: string;
  email: string;
  role: "creator" | "consumer" | "admin";
  bio?: string;
  profileImage?: string;
  google_id?: string;
  source?: "local" | "google";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    bio?: string
  ) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => void;
  fetchUser: () => Promise<void>;
  setAuthToken: (t: string | null) => void; // <-- expose this
  isAuthenticated: boolean;
  isCreator: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Single place to update token + localStorage
  const setAuthToken = (t: string | null) => {
    setToken(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
    // No need to touch axios.defaults; interceptor reads from localStorage
  };

  const fetchUser = async () => {
    try {
      const { data } = await authApi.get(`/api/users/profile`);
      setUser({
        ...data,
        source: data.google_id ? "google" : "local",
      });
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error: any) {
      console.error("User auth error:", error?.response || error);
      const savedUser = localStorage.getItem("user");
      if (token && savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser({
          ...parsed,
          source: parsed.google_id ? "google" : "local",
        });
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Restore session on mount
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        ...parsed,
        source: parsed.google_id ? "google" : "local",
      });
    }
    if (savedToken) fetchUser();
    else setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await publicApi.post(`/api/auth/login`, {
      username,
      password,
    });
    setAuthToken(data.token); // set token first (interceptor ready)
    setUser({
      ...data.user,
      source: data.user.google_id ? "google" : "local",
    });
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "/browse";
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    bio?: string
  ) => {
    const { data } = await publicApi.post(`/api/auth/register`, {
      username,
      email,
      password,
      bio,
    });
    setAuthToken(data.token);
    setUser({
      ...data.user,
      source: data.user.google_id ? "google" : "local",
    });
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const loginWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.clear();
    window.location.href = "/";
  };

  const isAuthenticated = !!user;
  const isCreator = user?.role === "creator";

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loginWithGoogle,
    fetchUser,
    setAuthToken, // <-- expose to components
    isAuthenticated,
    isCreator,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
