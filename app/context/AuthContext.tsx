import { createContext, useEffect, useState } from "react";
import { User } from "../types/user.type";
import { getToken } from "../utils/token";
import UserService from "../services/user.service";

const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const token = await getToken();
    if (token) {
      fetchUser();
    }
  };

  const fetchUser = async () => {
    const user = await UserService.fetchCurrentUser();
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
export default AuthContext;
