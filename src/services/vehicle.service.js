import  api  from "./api";

export async function getVehicles() {
  const { data } = await api.get("/vehicles"); // GET http://localhost:5000/api/vehicles
  return data;
}