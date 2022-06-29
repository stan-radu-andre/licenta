import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Avatar, Collapse, Typography, Rating } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { red } from '@mui/material/colors';
import { findIcon } from '../../constants/CarBrands';
import { ExpandMore } from '../../utils/uiUtils';
import format from 'date-fns/format';

function FeedbackCard(props) {
  const { appointment } = props;
  const [expanded, setExpanded] = useState(true);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  if (!appointment || !appointment.user) {
    return (<></>);
  }
  const { car = {} } = appointment;
  const carIcon = findIcon(car.maker);

  return (
    <Card className='mt-2' variant="outlined">
      {/* sursa: https://mui.com/material-ui/react-card/ */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="user">
            <img src={carIcon} style={{ width: '45px' }} alt={car.maker} />
          </Avatar>
        }
        action={
          (
            <>
              <Typography component="legend">Your rating</Typography>
              <Rating name="read-only" value={appointment.rating} disabled={!appointment.rating} readOnly />
              {/* sursa: https://mui.com/material-ui/react-rating/ */}
              {!appointment.rating && <Typography>No feedback yet</Typography>}
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
        title={`${car.maker} ${car.model}`}
        subheader={format(new Date(appointment.date), 'dd/MM/yyyy')}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography textAlign={'left'} paragraph><b>Feedback:</b> {appointment.ratingFeedback}</Typography>
          <Typography textAlign={'left'} paragraph><b>Name:</b> {appointment.user.name}</Typography>
          <Typography textAlign={'left'} paragraph><b>Telephone:</b> {appointment.user.number}</Typography>
          <Typography textAlign={'left'} paragraph><b>Age:</b> {appointment.user.age}</Typography>
          <Typography textAlign={'left'} paragraph><b>Email:</b> {appointment.user.email}</Typography>
          <Typography textAlign={'left'} paragraph><b>Created at:</b> {format(new Date(appointment.createdAt), 'dd/MM/yyyy')}</Typography>
          <Typography textAlign={'left'} paragraph><b>Problem description:</b> {appointment.description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}
export default FeedbackCard;
