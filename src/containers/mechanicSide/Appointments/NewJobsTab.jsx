import React, { useState, useEffect } from 'react';
import JobCard from '../../../components/MechanicJobs/JobCard';
import { getRequest } from '../../../utils/requests';
import { Draggable } from '@fullcalendar/interaction';

function NewJobsTab(props) {
  const { bookedAppointment } = props;
  const [stateAppointments, setAppointments] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    getRequest(`http://localhost:4000/appointments/mechanic/${user._id}/new`)
      .then((response) => {
        const { appointments } = response.data;
        setAppointments(appointments);
      })
    // sursa: https://fullcalendar.io/docs/external-dragging
    var containerEl = document.getElementById('external-events');
    if (containerEl) {
      new Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
          const { event = '{}' } = eventEl?.dataset;
          const elementData = JSON.parse(event);
          return {
            title: elementData.car.maker + ' ' + elementData.car.model,
            create: false
          };
        },
      });
    }
  }, [])

  useEffect(() => {
    // remove the booked appointment from the "new appointment" tab
    setAppointments((stateAppointments) => {
      if (!stateAppointments || !bookedAppointment) {
        return stateAppointments;
      }
      return stateAppointments.filter((appointment) =>
        appointment._id !== bookedAppointment._id
      )
    });
  }, [bookedAppointment]);

  return (
    <div id='external-events'>
      <p className='mt-3'>Drag a job to the calendar make an appointment:</p>
      {stateAppointments.map((appointment) => (
        <JobCard newCard key={appointment._id} appointment={appointment} />
      ))
      }
    </div>
  )
}
export default NewJobsTab;