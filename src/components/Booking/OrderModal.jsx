import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Box, Grid, Checkbox, FormControlLabel } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import Calendar from "react-select-date";
import Alerts from '../../components/Alerts';
import { postRequest, getRequest } from '../../utils/requests';
import './booking.scss';

// sursa: https://mui.com/material-ui/react-modal/
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: '5px'
};
function OrderModal(props) {
  const calendarRef = useRef();
  const { opendModal, handleClose, handleSumbitOrder, appointment, mechanic: mechanicUser = {} } = props;
  const [anytime, setAnytime] = useState(false)
  const [preferedDates, setPreferedDates] = useState([])
  const [asap, setAsap] = useState(false)
  const [messages, setMessages] = useState([]);
  const [mechanicAppointments, setMechanicAppointments] = useState([]);

  useEffect(() => {
    if (mechanicUser.mechanic) {
      getRequest(`http://localhost:4000/appointments/mechanic/${mechanicUser._id}/booked`)
        .then((response) => {
          const { appointments } = response.data;
          setMechanicAppointments(appointments);
        })
    }
  }, [mechanicUser]);

  const handleMakeUnassignedOrder = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setMessages([{ message: 'Log in first', type: 'error' }]);
      return;
    }
    let order = {
      maker: appointment.maker,
      year: appointment.year,
      model: appointment.model,
      description: appointment.description,
      userId: appointment.userId,
      status: 'unassigned',
      preferedDates, asap, anytime
    };
    if (mechanicUser._id) {
      order = {
        ...order,
        mechanicId: mechanicUser._id,
        status: 'new'
      }
    }

    postRequest(`http://localhost:4000/appointments/create`, order)
      .then((req) => {
        handleSumbitOrder();
      })
      .catch(e => {
        const { response: { data } } = e;
        if (data?.error) {
          return setMessages([{ message: data.error.message ? data.error.message : data.error, type: 'error' }]);
        }
        return setMessages([{ message: 'Something went wrong' }]);
      })
  }

  return (
    <Modal
      hideBackdrop
      open={opendModal}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
      className="booking-modal"
    >
      <Box sx={{ ...style }}>
        <div className="d-flex justify-content-end"><Button id="modal-close-button" onClick={handleClose}>X</Button></div>
        <h2 id="child-modal-title">Order</h2>
        <h5 id="child-modal-description">
          Make an order and an mechanic will make an appointment to fix your car.
        </h5>
        <Alerts messages={messages} />
        <Grid container spacing={2} >
          {mechanicUser.mechanic &&
            <Grid item sm={12} lg={6}>
              <p>This is calendar of the mechanic:</p>
              {/* sursa: https://fullcalendar.io/docs/react */}
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                weekends={false}
                droppable={true}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: false
                }}
                events={
                  mechanicAppointments.map((appointment) => ({ id: appointment._id, title: appointment.car?.maker || 'Busy doing car', date: appointment.date }))}
              />
            </Grid>
          }
          <Grid item sm={12} lg={mechanicUser.mechanic ? 6 : 12}>
            {/* sursa: https://www.npmjs.com/package/react-select-date */}
            <p className='mt-5'>Select the dates you prefer to go to the mechanic:</p>
            <div className={`mb-2 mt-5 ${anytime && 'disabled-calendar'}`}>
              <Calendar
                onSelect={(dates) => setPreferedDates(dates)}
                templateClr='blue'
                selectDateType='multiple'
                showDateInputField={false}
                disableDates='past'
              />
            </div>
            {/* sursa: https://mui.com/material-ui/react-checkbox/#main-content */}
            <FormControlLabel control={<Checkbox onChange={(e) => setAnytime(e.target.checked)} />} label="Anytime" />
            <FormControlLabel control={<Checkbox onChange={(e) => setAsap(e.target.checked)} />} label="As soon as posible" />
            <Grid item sm={12}>
              <Button className="p-3 float-right" variant="outlined" onClick={handleMakeUnassignedOrder}>Make an order</Button>
            </Grid>
          </Grid>
        </Grid>
      </Box >
    </Modal >

  )
}

export default OrderModal;
