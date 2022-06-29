import { getRequest, putRequest } from './requests';

export const getMechanic = async (id) => {
  const response = await getRequest(`http://localhost:4000/mechanics/${id}`);
  const { data = {} } = response;
  const { mechanics } = data;
  return mechanics;
};

export const getAppointments = async (userType) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await getRequest(
    `http://localhost:4000/appointments/${userType}/${user._id}/booked`
  );
  const { data = {} } = response;
  const { appointments } = data;
  return appointments;
};

export const updateAppointmentStatus = async (
  appointmentId,
  newDate,
  status
) => {
  const response = await putRequest(`http://localhost:4000/appointments/book`, {
    appointmentId,
    newDate,
    status,
  });
  const { data = {} } = response;
  const { appointment } = data;
  return appointment;
};

export const assignAppointment = async (appointmentId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await putRequest(`http://localhost:4000/appointments/book`, {
    appointmentId,
    mechanicUserId: user._id,
    status: 'new',
  });
  const { data = {} } = response;
  const { appointment } = data;
  return appointment;
};

export const updateAppointmentRating = async (
  appointmentId,
  rating,
  ratingFeedback
) => {
  const response = await putRequest(
    `http://localhost:4000/appointments/updateItemWithId/${appointmentId}`,
    {
      rating,
      ratingFeedback,
    }
  );
  const { data = {} } = response;
  const { appointment } = data;
  return appointment;
};
