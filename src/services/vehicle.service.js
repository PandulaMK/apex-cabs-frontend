import  api  from "./api";

export async function getVehicles() {
  const { data } = await api.get("/vehicles"); 
}