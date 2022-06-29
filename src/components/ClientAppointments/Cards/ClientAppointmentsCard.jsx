import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Avatar, Button, Collapse, Typography, Rating, TextareaAutosize } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { red } from '@mui/material/colors';
import { findIcon } from '../../../constants/CarBrands';
import { ExpandMore } from '../../../utils/uiUtils'
import { updateAppointmentRating } from '../../../utils/apiRequests'
import Alerts from '../../Alerts';
import isPast from 'date-fns/isPast';
import format from 'date-fns/format';

// sursa: https://mui.com/material-ui/react-card/
function ClientAppointmentsCard(props) {
  const { appointment, mechanic: mechanicResponse = {} } = props;
  const isPastAppointment = isPast(new Date(appointment.date));
  const shouldDisplayFeedback = isPastAppointment && appointment.status === 'booked';
  const [expanded, setExpanded] = useState(shouldDisplayFeedback && !appointment.rating);
  const [rating, setRating] = useState(appointment.rating);
  const [ratingFeedback, setFeedback] = useState(appointment.ratingFeedback || '');
  const [messages, setMessages] = useState([]);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  if (!appointment) {
    return (<></>);
  }
  const { car = {} } = appointment;
  const carIcon = findIcon(car.maker);
  const onSubmitFeedback = async () => {
    try {
      await updateAppointmentRating(appointment._id, rating, ratingFeedback)
      setMessages(([{ message: 'Success', type: 'success' }]))
    } catch (err) {
      setMessages([{ message: 'Something went wrong', type: 'error' }])
    }
  }
  return (
    <Card className='mt-2' variant="outlined">
      <Alerts messages={messages} />
      {/* sursa: https://mui.com/material-ui/react-card/ */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="mechanicResponse">
            <img src={carIcon} style={{ width: '45px' }} alt={car.maker} />
          </Avatar>
        }
        action={
          (
            <>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </>
          )
        }
        title={`${appointment.status.toUpperCase()} appointment for`}
        subheader={`${car.maker} ${car.model}`}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {mechanicResponse._id &&
          <CardContent>
            {appointment.date && <Typography textAlign={'left'} paragraph><b>Date:</b> {format(new Date(appointment.date), 'hh:mm dd/MM/yyyy')}</Typography>}
            <Typography textAlign={'left'} paragraph><b>Name:</b> {mechanicResponse.name}</Typography>
            <Typography textAlign={'left'} paragraph><b>Telephone:</b> {mechanicResponse.number}</Typography>
            <Typography textAlign={'left'} paragraph><b>Age:</b> {mechanicResponse.age}</Typography>
            <Typography textAlign={'left'} paragraph><b>Email:</b> {mechanicResponse.email}</Typography>
            <Typography textAlign={'left'} paragraph><b>Works on:</b>
              {mechanicResponse.mechanic && mechanicResponse.mechanic.preferedCars.map((car, index) => (<li key={index}>{car.maker}s</li>))}</Typography>
            {shouldDisplayFeedback && (
              <>
                <Typography textAlign={'left'} component="legend">Rating:</Typography>
                <Rating name="read-only" value={rating}
                  onChange={(e, newValue) => {
                    setRating(newValue);
                  }}
                />
                <Typography textAlign={'left'} component="legend">Feedback:</Typography>
                <Typography textAlign={'left'} paragraph>
                  <TextareaAutosize
                    aria-label="empty textarea"
                    placeholder="Give feedback"
                    style={{ width: '100%' }}
                    value={ratingFeedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </Typography>
                <Button onClick={onSubmitFeedback}>Sumbit feedback</Button>
              </>
            )}
          </CardContent>
        }
      </Collapse>
    </Card>
  )
}
export default ClientAppointmentsCard;
