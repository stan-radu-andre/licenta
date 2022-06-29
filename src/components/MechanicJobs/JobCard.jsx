import React, { } from 'react';
import { Card, CardContent, CardHeader, Avatar, Collapse, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Calendar from "react-select-date";
import format from 'date-fns/format';
import { findIcon } from '../../constants/CarBrands';
import { ExpandMore } from '../../utils/uiUtils'

// sursa: https://mui.com/material-ui/react-card/
function JobCard(props) {
  const { appointment, newCard } = props;
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  if (!appointment) {
    return (<></>);
  }
  const { car = {} } = appointment;
  const { user = {} } = appointment;
  const carIcon = findIcon(car.maker);
  return (
    <Card className={`${newCard && 'fc-event'} mt-2`} data-event={JSON.stringify(appointment)} variant="outlined">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="mechanic">
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
        title={`${car.maker} ${car.model} ${car.year}`}
        subheader={appointment.status === 'new' ? appointment.description : format(new Date(appointment.date), 'hh:mm dd/MM/yyyy')}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography textAlign={'left'} paragraph><b>Job description:</b> {appointment.description}</Typography>
          <Typography textAlign={'left'} paragraph><b>Client Name:</b> {user.name}</Typography>
          <Typography textAlign={'left'} paragraph><b>Contact telephone:</b> {user.number}</Typography>
          <Typography textAlign={'left'} paragraph><b>Email:</b> {user.email}</Typography>
          {appointment.status === 'new' &&
            <>
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
            </>
          }
        </CardContent>
      </Collapse>
    </Card>
  )
}
export default JobCard;
