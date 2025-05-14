import api from "./api.service";

const fetchById = async (id: string) => {
  const response = await api.get(`/reservations/classroom/${id}`);
  return response.data;
};

const bookClassroom = async (data: any) => {
  const response = await api.post("/reservations", data);
  return response.data;
};

const fetchAll = async () => {
  const response = await api.get("/reservations/me");
  return response.data;
};

const deleteOne = async (id: string) => {
  const response = await api.delete(`/reservations/${id}`);
  return response.data;
};

const ReservationService = {
  fetchById,
  bookClassroom,
  fetchAll,
  deleteOne,
};

export default ReservationService;
