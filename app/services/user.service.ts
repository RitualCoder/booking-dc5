import api from "./api.service";

const ENDPOINT = "/users";

const fetchCurrentUser = async () => {
  const response = await api.get(`${ENDPOINT}/me`);
  return response.data;
};

const updateUser = async (userId: string, userData: any) => {
  const response = await api.put(`${ENDPOINT}/${userId}`, userData);
  return response.data;
};

const UserService = {
  updateUser,
  fetchCurrentUser,
};

export default UserService;
