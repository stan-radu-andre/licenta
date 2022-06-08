import './Offers.scss';
import React, { useState, useEffect } from 'react';
import OfferCard from '../../../components/MechanicAppointments/OfferCard';
import { getRequest } from '../../../utils/requests';
import { Card, CardContent } from '@mui/material';

function Offers() {
  const [stateAppointments, setAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    getRequest(`http://localhost:4000/users/appointments/${user._id}`)
      .then((response) => {
        const { appointments } = response.data;
        setAppointments(appointments);
      })
  }, [])
  console.log('uaasder', user);
  return (
    <>
      <Card>
        <CardContent>
          {stateAppointments.map((appointment) => (
            <OfferCard appointment={appointment} mechanic={user} />
          ))
          }
        </CardContent>
      </Card>
    </>
  )
}
export default Offers;
