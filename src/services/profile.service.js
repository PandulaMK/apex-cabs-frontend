import  api  from "./api";

export async function getMyProfile() {
  const { data } = await api.get("/users/me");
  return data;
}

export async function updateMyProfile(payload) {
  const { data } = await api.put("/users/me", payload);
  return data;
}

export async function changePassword({ currentPassword, newPassword }) {
  const { data } = await api.put("/users/me/password", {
    currentPassword,
    newPassword,
  });
  return data;
}

export async function getMyBookings() {
  const { data } = await api.get("/bookings/my");
  return data;
}

export async function cancelBooking(id) {
  const { data } = await api.put(`/bookings/${id}/cancel`);
  return data;
}