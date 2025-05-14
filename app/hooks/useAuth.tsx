import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import AuthService from "../services/auth.service";
import { setToken } from "../utils/token";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const signin = async (email: string, password: string) => {
    const response = await AuthService.signin(email, password);
    setToken(response.token);
    setUser(response.user);
  };

  const signout = async () => {
    setUser(null);
  };

  return { signin, signout };
};

export default useAuth;
