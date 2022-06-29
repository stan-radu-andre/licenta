import React, { useState, useEffect } from 'react';
import ClientAppointmentsCard from '../../../components/ClientAppointments/Cards/ClientAppointmentsCard';
import { getRequest } from '../../../utils/requests';

function NewAppointmentsTab() {
  const [stateAppointments, setAppointments] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    getRequest(`http://localhost:4000/appointments/client/${user._id}/new`)
      .then((response) => {
        const { appointments: newAppointments } = response.data;
        getRequest(`http://localhost:4000/appointments/client/${user._id}/unassigned`)
          .then((response) => {
            const { appointments: unassignedAppointments } = response.data;
            setAppointments([...newAppointments, ...unassignedAppointments]);
          })
      })
  }, [])
  return (
    <>
      {stateAppointments.length === 0 && <>No appointments</>}
      {stateAppointments.map((appointment) => (
        <ClientAppointmentsCard appointment={appointment} mechanic={appointment.mechanic || {}} />
      ))
      }
    </>
  )
}
export default NewAppointmentsTab;
