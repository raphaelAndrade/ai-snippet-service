import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
  } from "react";
  import { User } from "~/types/user";
  
  interface AuthContextValue {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
  }
  
  const AuthContext = createContext<AuthContextValue | undefined>(undefined);
  
  const USER_KEY = "user";
  const TOKEN_KEY = "token";
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
  
    useEffect(() => {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        const storedToken = localStorage.getItem(TOKEN_KEY);
  
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (err) {
        console.warn("Failed to parse auth from localStorage", err);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }, []);
  
    const login = useCallback((u: User, t: string) => {
      setUser(u);
      setToken(t);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      localStorage.setItem(TOKEN_KEY, t);
    }, []);
  
    const logout = useCallback(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
  }
  