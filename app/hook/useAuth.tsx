import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import AuthService from "../services/auth.service";
import { removeToken, setToken } from "../utils/token";

export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await AuthService.signIn(email, password);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      removeToken();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await AuthService.signUp(name, email, password);

      console.log("response", response);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return { user, setUser, signIn, signOut, signUp };
};
