import React, { useState, useEffect } from 'react';
import JobCard from '../../../components/MechanicJobs/JobCard';
import { getRequest } from '../../../utils/requests';

function BookedJobsTab() {
  const [stateAppointments, setAppointments] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    getRequest(`http://localhost:4000/appointments/mechanic/${user._id}/booked`)
      .then((response) => {
        const { appointments } = response.data;
        setAppointments(appointments);
      })
  }, [])
  return (
    <>
      {stateAppointments.map((appointment) => (
        <JobCard key={appointment._id} appointment={appointment} />
      ))
      }
    </>
  )
}
export default BookedJobsTab;