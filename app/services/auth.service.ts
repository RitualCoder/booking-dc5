import api from "./api.service";

const ENDPOINT = "/auth";

const signIn = async (email: string, password: string) => {
  const response = await api.post(`${ENDPOINT}/signin`, {
    email,
    password,
  });

  return response.data;
};

const signUp = async (name: string, email: string, password: string) => {
  const response = await api.post(`${ENDPOINT}/signup`, {
    email,
    password,
    name,
  });

  return response.data;
};



const AuthService = {
  signIn,
  signUp,
};

export default AuthService;
