import React, { useState, useContext } from 'react';
import {
  Redirect,
} from "react-router-dom";
import { Card, CardContent, CardHeader, Avatar, Button, Collapse, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import { AppointmentContext } from '../../containers/clientSide/FindMechanic';

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
  const [redirect, setRedirect] = useState(false);
  const [selectedMechanic, setMechanic] = useState({});
  const { mechanic } = props;
  const [expanded, setExpanded] = React.useState(false);
  const appointmentData = useContext(AppointmentContext);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleSumbitBooking = (newMechanic) => (e) => {
    // sursa https://stackoverflow.com/questions/62249713/how-to-redirect-and-pass-data-as-props-on-form-submit-in-react
    e.preventDefault();
    setRedirect(true);
    setMechanic(newMechanic)
  };

  if (redirect) {

    return <Redirect to={{ pathname: '/appointmentProcess', data: { selectedMechanic, appointmentData } }} />
  }
  return (
    <Card className='mt-2' variant="outlined">
      {/* sursa: https://mui.com/material-ui/react-card/ */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="mechanic">
            {mechanic.name[0]}
          </Avatar>
        }
        action={
          (
            <>
              <Button onClick={handleSumbitBooking(mechanic)}>Make an appointment</Button>
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
        title={`${mechanic.name} ${mechanic.number}`}
        subheader='works on cars'
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}
export default CustomMechanicCard;