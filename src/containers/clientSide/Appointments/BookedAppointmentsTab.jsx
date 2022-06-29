import React, { useState, useEffect } from 'react';
import ClientAppointmentsCard from '../../../components/ClientAppointments/Cards/ClientAppointmentsCard';
import { getRequest } from '../../../utils/requests';
import { Card, CardContent } from '@mui/material';

function BookedAppointmentsTab() {
  const [stateAppointments, setAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    getRequest(`http://localhost:4000/appointments/client/${user._id}/booked/`)
      .then((response) => {
        const { appointments } = response.data;
        setAppointments(appointments);
      })
  }, [])
  return (
    <>
      <Card>
        <CardContent>
          {stateAppointments.length === 0 && <>No appointments</>}
          {stateAppointments.map((appointment) => (
            <ClientAppointmentsCard key={appointment._id} appointment={appointment} mechanic={appointment.mechanic} />
          ))
          }
        </CardContent>
      </Card>
    </>
  )
}
export default BookedAppointmentsTab;
