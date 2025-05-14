import api from "./api.service";

const fetchById = async (id: string) => {
  console.log("fetchById", id);
  const response = await api.get(`/reservations/classroom/${id}`);
  console.log("response", response);
  return response.data;
};

const bookClassroom = async (data: any) => {
  const response = await api.post("/reservations", data);
  console.log("response data", response.data);
  return response.data;
};

const fetchAll = async () => {
  const response = await api.get("/reservations/me");
  return response.data;
};

const ReservationService = {
  fetchById,
  bookClassroom,
    fetchAll,
};

export default ReservationService;
