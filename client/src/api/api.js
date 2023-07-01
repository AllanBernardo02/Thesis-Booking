import axios from "axios";

// export const BASE_URL = "http://localhost:5000/api";
export const BASE_URL = "https://starwheal.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const login = async (data) => {
  const res = await api.post("/auth/login", data, {
    withCredentials: true,
  });
  return res.data;
};

export const register = async (data) => {
  const res = await api.post("/auth/register", data);
  return res;
};

export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res;
};

export const createDoctorAccount = async (data) => {
  const res = await api.post("/admin/create-doctor-account", data);
  return res;
};

export const getAllDoctors = async () => {
  const res = await api.get("/admin/all-doctors");
  return res;
};

export const getAllActiveDoctors = async () => {
  const res = await api.get("/admin/all-active-doctors");
  return res;
};

export const getAllPatients = async () => {
  const res = await api.get("/admin/all-patients");
  return res;
};

export const addServices = async (data) => {
  const res = await api.post("/admin/add-clinic-service", data, {
    withCredentials: true,
  });
  return res;
};

export const updateServices = async (data) => {
  const res = await api.post(
    `/admin/update-clinic-service/${data.id}`,
    data.clinicService,
    {
      withCredentials: true,
    }
  );
  return res;
};

export const updateDoctorAccount = async (data) => {
  const res = await api.patch(
    `/admin/update-doctor-account/${data.id}`,
    data.doctorAccount,
    {
      withCredentials: true,
    }
  );
  return res;
};

export const updatePatient = async (data) => {
  const res = await api.patch(
    `/admin/update-patient-account/${data.id}`,
    data.patientAccount,
    {
      withCredentials: true,
    }
  );
  return res;
};

export const updatePatientDoctor = async (data) => {
  const res = await api.patch(
    `/admin/update-patient-account-doctor/${data.id}`,
    data.patientAccountDoctor,
    {
      withCredentials: true,
    }
  );
  return res;
};

export const deleteServices = async (data) => {
  const res = await api.post(`/admin/delete-clinic-service/${data.id}`, {
    withCredentials: true,
  });
  return res;
};

export const getServices = async () => {
  const res = await api.get("/admin/get-services");
  return res;
};

export const getDoctorProfile = async (data) => {
  const res = await api.get(`/doctor/profile/${data.id}`, {
    withCredentials: true,
  });
  return res;
};

export const updateDoctorProfile = async (data) => {
  const res = await api.put(`/doctor/profile/${data.id}`, data.values, {
    withCredentials: true,
  });
  return res;
};

export const updateDoctorStatus = async (data) => {
  const res = await api.put(`/admin/doctor-status/${data.id}`, data.values, {
    withCredentials: true,
  });
  return res;
};

export const addDoctorSchedule = async (data) => {
  const res = await api.post(`/doctor/add-schedule`, data, {
    withCredentials: true,
  });
  return res;
};

export const getDoctorSchedule = async (data) => {
  const res = await api.get(`/doctor/get-schedules/${data.id}`, {
    withCredentials: true,
  });
  return res;
};

export const bookAppointment = async (data) => {
  const res = await api.post("/user/book-appointment", data, {
    withCredentials: true,
  });
  return res;
};

export const cancelAppointment = async (data) => {
  const res = await api.post("/user/cancel-appointment", data, {
    withCredentials: true,
  });
  return res;
};

export const cancelAppointmentDoctor = async (data) => {
  const res = await api.post("/user/cancel-appointment-doctor", data, {
    withCredentials: true,
  });
  return res;
};

export const approveAppointment = async (data) => {
  const res = await api.post("/doctor/approve-appointment", data, {
    withCredentials: true,
  });
  return res;
};

export const doneAppointment = async (data) => {
  const res = await api.post("/doctor/done-appointment", data, {
    withCredentials: true,
  });
  return res;
};

export const getAllUserAppointments = async (data) => {
  const res = await api.get("/user/get-appointments", {
    withCredentials: true,
  });
  return res;
};

export const getAllDoctorAppointments = async () => {
  const res = await api.get("/doctor/appointments", {
    withCredentials: true,
  });
  return res;
};

export const getAllAppointments = async () => {
  const res = await api.get("/doctor/all-appointments", {
    withCredentials: true,
  });
  return res;
};

export const getAllDoctorPatients = async (id) => {
  const res = await api.get(`/doctor/all-doctor-patients/${id}`);
  return res;
};

//////// test function
const test = () => {};
