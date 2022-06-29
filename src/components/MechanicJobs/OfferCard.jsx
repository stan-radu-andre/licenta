import React, { } from 'react';
import { Card, CardContent, CardHeader, Avatar, Button, Collapse, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import Calendar from "react-select-date";
import format from 'date-fns/format';
import { findIcon } from '../../constants/CarBrands';
import { assignAppointment } from '../../utils/apiRequests';

// sursa: https://mui.com/material-ui/react-card/
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function OfferCard(props) {
  const { appointment, onAsignAppointment } = props;
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  if (!appointment || !appointment.user) {
    return (<></>);
  }

  const handleAsignAppointment = () => {
    assignAppointment(appointment._id);
    onAsignAppointment(appointment._id);
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
              <Button className="p-3" variant="outlined" onClick={handleAsignAppointment}>Asign order</Button>

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
        title={`${appointment.user.name} ${appointment.user.number}`}
        subheader={`${car.maker} ${car.model}`}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography textAlign={'left'} paragraph><b>Name:</b> {appointment.user.name}</Typography>
          <Typography textAlign={'left'} paragraph><b>Telephone:</b> {appointment.user.number}</Typography>
          <Typography textAlign={'left'} paragraph><b>Age:</b> {appointment.user.age}</Typography>
          <Typography textAlign={'left'} paragraph><b>Email:</b> {appointment.user.email}</Typography>
          <Typography textAlign={'left'} paragraph><b>Created at:</b> {format(new Date(appointment.createdAt), 'dd/MM/yyyy')}</Typography>
          <Typography textAlign={'left'} paragraph><b>Problem description:</b> {appointment.description}</Typography>
          <Typography textAlign={'left'} paragraph><b>Client wants appointment as soon as posible:</b> {appointment.asap ? 'Yes' : 'No'}</Typography>

          <Typography textAlign={'left'} paragraph><b>Prefered dates:</b> {appointment.anytime ? 'Anytime' : ''} </Typography>
          {!appointment.anytime &&
            <div className="readonly-calendar">
              <Calendar
                onSelect={() => { }}
                templateClr='blue'
                selectDateType='multiple'
                showDateInputField={false}
                defaultValue={appointment.preferedDates}
              />
            </div>
          }
        </CardContent>
      </Collapse>
    </Card>
  )
}
export default OfferCard;
