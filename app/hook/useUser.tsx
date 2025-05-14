import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import UserService from "../services/user.service";

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);

  const updateUser = async (id: string, data: any) => {
    try {
      console.log("data : ", data, "id : ", id);
      const response = await UserService.updateUser(id, data);
      console.log("response", response);
      setUser(response);
    } catch (error) {
      console.error("Error update in:", error);
    }
  };

  return { updateUser };
};
