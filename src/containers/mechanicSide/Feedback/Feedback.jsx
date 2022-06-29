import './Feedback.scss';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { getAppointments } from '../../../utils/apiRequests';
import FeedbackCard from '../../../components/Feedback/FeedbackCard';
import isPast from 'date-fns/isPast';

function Feedback() {
  const [stateAppointments, setAppointments] = useState([]);
  useEffect(() => {
    getAppointments('mechanic')
      .then((appointments) => {
        setAppointments(appointments.filter(appointment => isPast(new Date(appointment.date))));
      })
  }, [])
  return (
    <>
      <Card className='scroll-container-card card-max-width'>
        <CardContent>
          {stateAppointments.map((appointment) => (
            <FeedbackCard key={appointment._id} appointment={appointment} />
          ))
          }
        </CardContent>
      </Card>
    </>
  )
}
export default Feedback;
