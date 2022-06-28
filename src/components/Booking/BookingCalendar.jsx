import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Modal, Typography, TextField, Stack, Button } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import roLocale from 'date-fns/locale/ro';
import { setMinutes, setHours } from 'date-fns/esm';
import { updateAppointmentStatus } from '../../utils/apiRequests';

// sursa: https://mui.com/material-ui/react-modal/#main-content
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function BookingCalendar(props) {
  const calendarRef = useRef()
  const { appointments, isMechanic, setBookedAppointment } = props;
  const [stateAppointments, setAppointments] = useState([]);
  const [dropedAppointment, setDropedAppointment] = useState({ newDate: '', appointmentId: '', appointmentObject: {} });
  const [confirmModal, setConfirmModal] = useState({ open: false, revert: () => { } });

  const handleCloseModal = () => {
    // confirmModal.revert();
    setConfirmModal({ open: false, revert: () => { } });
  }
  useEffect(() => {
    if (appointments) {
      setAppointments(appointments.filter((appointment) => appointment.status === 'booked'));

    }
  }, [appointments])
  const handleDateClick = (arg) => {
    if (props.setAppointmentDate) {
      props.setAppointmentDate(arg.date);
      setAppointments([...appointments, { title: 'Your selected date', date: arg.dateStr }])
    }
  }

  const handleDropEvent = (dropEvent) => {
    const { event = '{}' } = dropEvent.draggedEl.dataset;
    setConfirmModal({ open: true, revert: {} });

    const draggedAppointment = JSON.parse(event);
    dropEvent.date = setHours(dropEvent.date, 8);
    dropEvent.date = setMinutes(dropEvent.date, 0);
    draggedAppointment.date = dropEvent.date;
    setDropedAppointment(draggedAppointment);
  }

  // const handleReciveEvent = ({ event, revert }) => {
  //   setConfirmModal({ open: true, revert });
  //   let calendarApi = calendarRef.current.getApi()
  //   console.log(event, calendarApi.getEvents());
  // }

  const handleMakeAppointment = async () => {
    setConfirmModal({ open: false, revert: () => { } });
    //make request
    setBookedAppointment(dropedAppointment);
    dropedAppointment.status = 'booked';
    await updateAppointmentStatus(dropedAppointment._id, dropedAppointment.date, 'booked');
    setAppointments([
      ...stateAppointments,
      dropedAppointment
    ])
  }
  return (
    <>
      {/* sursa: https://fullcalendar.io/docs/react */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        dateClick={handleDateClick}
        editable={isMechanic}
        dayMaxEvents={isMechanic}
        droppable={true}
        drop={handleDropEvent}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        events={
          stateAppointments.map((appointment) => ({ id: appointment._id, title: appointment.car?.maker || 'Busy doing car', date: appointment.date }))}
      />
      <Modal
        open={confirmModal.open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select the time of the appointment
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={roLocale}>
            {/* sursa:https://mui.com/x/react-date-pickers/time-picker/ */}
            <Stack className="mt-3 mb-3" spacing={3}>
              <TimePicker
                label="Time"
                value={dropedAppointment.date}
                onChange={(newTime) => setDropedAppointment((appointment) => ({ ...appointment, date: newTime }))}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
          <Button className="p-3" variant="outlined" onClick={handleMakeAppointment}>Make appointment</Button>
          <Button className="p-3 ml-5" variant="outlined" onClick={handleCloseModal}>Cancel</Button>
        </Box>
      </Modal>
    </>
  )
}

export default BookingCalendar;
