import './UnassignedOffers.scss';
import React, { useState, useEffect } from 'react';
import OfferCard from '../../../components/MechanicJobs/OfferCard';
import { getRequest } from '../../../utils/requests';
import { Card, CardContent } from '@mui/material';

function UnassignedOffers() {
  const [stateAppointments, setAppointments] = useState([]);

  useEffect(() => {
    getRequest(`http://localhost:4000/appointments/all/unassigned`)
      .then((response) => {
        const { appointments } = response.data;
        setAppointments(appointments);
      })
  }, [])
  const onAsignAppointment = (appointmentId) => {
    setAppointments(stateAppointments.filter((appointment) => appointment._id !== appointmentId))
  }

  return (
    <>
      <Card className='scroll-container-card card-max-width'>
        <CardContent>
          {stateAppointments.map((appointment) => (
            <OfferCard key={appointment._id} appointment={appointment} onAsignAppointment={onAsignAppointment} />
          ))
          }
        </CardContent>
      </Card>
    </>
  )
}
export default UnassignedOffers;
