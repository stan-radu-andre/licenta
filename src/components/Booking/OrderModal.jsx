import React, { useState } from 'react';
import { Button, Modal, Box, Grid, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import roLocale from 'date-fns/locale/ro';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Calendar from "react-select-date";
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
  const { opendModal, handleClose, handleSumbitOrder } = props;
  const [minTime, setMinTime] = useState(new Date());
  const [maxTime, setMaxTime] = useState(new Date());
  const [anytime, setAnytime] = useState(false)
  const [preferedDates, setPreferedDates] = useState([])
  const [asap, setAsap] = useState(false)
  console.log(opendModal);
  return (
    <Modal
      hideBackdrop
      open={opendModal}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style }}>
        <div className="d-flex justify-content-end"><Button id="modal-close-button" onClick={handleClose}>X</Button></div>
        <h2 id="child-modal-title">Order</h2>
        <h5 id="child-modal-description">
          Make an order and an mechanic will make an appointment to fix your car.
        </h5>
        <p>Select the dates you prefer to go to the mechanic:</p>
        <Grid container spacing={2} >
          <Grid item sm={12} lg={8}>
            {/* sursa: https://www.npmjs.com/package/react-select-date */}
            <div className={`mb-2 mt-2 ${anytime && 'disabled-calendar'}`}>
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
          </Grid>
          <Grid item sm={12} lg={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={roLocale}>
              {/* sursa:https://mui.com/x/react-date-pickers/time-picker/ */}
              <Stack className="mt-3 mb-3" spacing={3}>
                <TimePicker
                  renderInput={(params) => <TextField {...params} />}
                  value={minTime}
                  label="Minimum time"
                  onChange={(newValue) => {
                    setMinTime(newValue);
                  }}
                  minTime={new Date(0, 0, 0, 8)}
                  maxTime={new Date(0, 0, 0, 18, 45)}
                  disabled={anytime}
                />
                <TimePicker
                  renderInput={(params) => <TextField {...params} />}
                  label="Maximum time"
                  value={maxTime}
                  onChange={(newValue) => {
                    setMaxTime(newValue);
                  }}
                  minTime={new Date(0, 0, 0, 8)}
                  maxTime={new Date(0, 0, 0, 18, 45)}
                  disabled={anytime}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Button className="p-3" variant="outlined" onClick={handleSumbitOrder({ preferedDates, maxTime, minTime, asap, anytime })}>Make an order</Button>
      </Box >
    </Modal >

  )
}

export default OrderModal;
