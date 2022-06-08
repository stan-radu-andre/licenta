import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";

function BookingCalendar(props) {
  const { appointments, isMechanic } = props;
  const [stateAppointments, setAppointments] = useState([]);
  useEffect(() => {
    if (appointments) {
      setAppointments(appointments);
    }
  }, [appointments])
  const handleDateClick = (arg) => {
    console.log(arg);
    if (props.setAppointmentDate) {
      props.setAppointmentDate(arg.date);
      setAppointments([...appointments, { title: 'Your selected date', date: arg.dateStr }])
    }
  }
  console.log(appointments);
  return (
    <>
      {/* sursa: https://fullcalendar.io/docs/react */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        dateClick={handleDateClick}
        editable={isMechanic}
        dayMaxEvents={isMechanic}
        eventDragStop={(e) => console.log(e)}
        events={
          stateAppointments.map((appointment) => ({ id: '23', title: appointment.title || 'Busy doing car', date: appointment.date }))}
      />
    </>
  )
}

export default BookingCalendar;
