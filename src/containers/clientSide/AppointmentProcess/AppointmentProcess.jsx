import React, { useState, useEffect } from 'react';
import {
  Redirect,
} from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import './AppointmentProcess.scss';
import Alerts from '../../../components/Alerts';
import { getRequest, postRequest } from '../../../utils/requests';
import BookingCalendar from '../../../components/Booking/BookingCalendar';

function AppointmentProcess(props) {
  const { location: { data } } = props;
  const [duration, setDuration] = useState('');
  const [messages, setMessages] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [mechanicAppointments, setMechanicAppointments] = useState([]);

  useEffect(() => {
    if (data) {
      const { selectedMechanic: mechanic = {} } = data;
      getRequest(`http://localhost:4000/users/appointments/${mechanic._id}`)
        .then((response) => {
          const { appointments } = response.data;
          setMechanicAppointments(appointments);
          console.log('appointments', appointments)
        })
    }
  }, [data]);

  const handleChangeDuration = (e) => {
    setDuration(e.target.value);
  }

  const sumbitOrder = () => {
    const { selectedMechanic: mechanic = {}, appointmentData = {} } = data;
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setMessages([{ message: 'Log in first', type: 'error' }]);
      return;
    }
    const order = {
      date: appointmentDate,
      maker: appointmentData.maker,
      year: appointmentData.year,
      model: appointmentData.model,
      description: appointmentData.description,
      userId: user._id,
      mechanicId: mechanic._id
    };
    postRequest(`http://localhost:4000/appointments/create`, order)
      .then((req) => {
        setMessages([{ message: 'Success', type: 'success' }]);
        console.log(req);
      })
      .catch(e => {
        console.log(e, e.response);
        const { response: { data } } = e;
        if (data?.error) {
          return setMessages([{ message: data.error.message ? data.error.message : data.error, type: 'error' }]);
        }
        return setMessages([{ message: 'Something went wrong' }]);
      })
  }

  if (data) {
    const { selectedMechanic: mechanic = {}, appointmentData = {} } = data;
    console.log(appointmentData, mechanic);
    return (
      <>
        <Alerts messages={messages} />
        {/* sursa: https://mui.com/material-ui/react-card/#main-content */}
        <Card sx={{ maxWidth: 'xl' }} className='m-4 grey-background'>
          <CardContent>
            <CardHeader
              className='title-text'
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  R
                </Avatar>
              }
              title={`Make an appointment with ${mechanic.name}`}
              subheader={`for ${appointmentData.maker} ${appointmentData.model} ${appointmentData.year}`}
            />
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <BookingCalendar
                  appointments={mechanicAppointments || []}
                  setAppointmentDate={setAppointmentDate}
                />
              </Grid>
              <Grid item xs={4}>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '98%' },
                    '& .MuiFormControl-fullWidth': { m: 1, width: '98%' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    {/* sursa: https://mui.com/material-ui/react-text-field/#form-props */}
                    <TextField
                      required
                      id="filled-required"
                      label="Detailed description"
                      defaultValue=""
                      variant="filled"
                    />
                    {/* sursa: https://mui.com/material-ui/react-select/#main-content */}
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Durration estimation</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={duration}
                        label="Age"
                        variant="filled"
                        onChange={handleChangeDuration}
                        className="text-left"
                      >
                        <MenuItem value={2}>Simple (2h)</MenuItem>
                        <MenuItem value={4}>Medium (4h)</MenuItem>
                        <MenuItem value={8}>Hard (8h)</MenuItem>
                        <MenuItem value={0}>Not sure</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className='justify-content-end'>
            <Button variant="contained" size="large" onClick={sumbitOrder}>Save</Button>
            <Button variant="outlined" size="large">Cancel</Button>
          </CardActions>
        </Card>
      </>
    )
  }
  else {
    return <Redirect to={{ pathname: '/home' }} />;
  }
}
export default AppointmentProcess;
