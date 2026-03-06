import api from "./api";

export async function createBooking(payload) {
  const { data } = await api.post("/bookings", payload);
  return data;
}