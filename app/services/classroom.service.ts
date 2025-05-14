import api from "./api.service";

const fetchAll = async () => {
  const response = await api.get("/classrooms");
  return response.data;
};

const fetchById = async (id: string) => {
  const response = await api.get(`/classrooms/${id}`);
  return response.data;
};

const ClassRoomService = {
  fetchAll,
  fetchById,
};

export default ClassRoomService;
