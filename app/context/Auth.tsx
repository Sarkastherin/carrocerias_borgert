import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import Auth, { Logout } from "my-auth-google";
const apiKey = import.meta.env.VITE_API_KEY;
const clientId = import.meta.env.VITE_CLIENT_ID;

type AuthContextType = {
  auth: boolean | null;
  isLoading: boolean;
  getAuth: () => Promise<void>;
  logout: () => void;
};
type AuthProviderProps = {
  children: ReactNode;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const authGoogle = async () => {
    try {
      const authResult = await Auth(apiKey, clientId);
      return authResult;
    } catch (error) {
      console.error('Error during authentication:', error);
      return false;
    }
  };
  
  const getAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const authResult = await authGoogle();
      setAuth(authResult);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    const logoutResult = Logout();
    if (logoutResult) {
      setAuth(false);
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ auth, isLoading, getAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};