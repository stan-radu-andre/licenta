import React, { } from 'react';

import { Card, CardContent, CardHeader, Avatar, Button, Collapse, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { blue } from '@mui/material/colors';

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

function CustomMechanicCard(props) {
  const { mechanic: mechanicResponse, order, handleSelectMechanic } = props;
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card className='mt-2' variant="outlined">
      {/* sursa: https://mui.com/material-ui/react-card/ */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: blue[200] }} aria-label="mechanic">
            {order}
          </Avatar>
        }
        action={
          (
            <>
              <Button onClick={() => handleSelectMechanic(mechanicResponse)}>Make an appointment</Button>
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
        title={`${mechanicResponse.name} ${mechanicResponse.number}`}
        subheader='works on cars'
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography textAlign={'left'} paragraph><b>Name:</b> {mechanicResponse.name}</Typography>
          <Typography textAlign={'left'} paragraph><b>Telephone:</b> {mechanicResponse.number}</Typography>
          <Typography textAlign={'left'} paragraph><b>Age:</b> {mechanicResponse.age}</Typography>
          <Typography textAlign={'left'} paragraph><b>Email:</b> {mechanicResponse.email}</Typography>
          <Typography textAlign={'left'} paragraph><b>Works on:</b> {mechanicResponse.mechanic && mechanicResponse.mechanic.preferedCars.map((car, index) => (<li key={index}>{car.maker} {car.model}</li>))}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}
export default CustomMechanicCard;
