import './Profile.scss';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Grid,
  Box,
  Modal,
  Card,
  Typography,
  CardContent,
  CardActions
} from '@mui/material';
import RegisterClient from '../../components/Login/registerClient';
import RegisterMechanic from '../../components/Login/registerMechanic';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function Profile({ open, onClose }) {
  const isMechanic = JSON.parse(localStorage.getItem('isMechanic'));
  const history = useHistory();
  const handleClose = () => {
    onClose();
  };
  const onLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isMechanic');
    onClose();
    history.push('/home');
  }
  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 'fit-content', maxWidth: '800px' }}>
          <Grid container>
            <Grid item xs={11}>
              <Card variant="">
                <CardActions>
                  <Button size="small" onClick={onLogOut}>Log out</Button>
                </CardActions>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Logged in as a {isMechanic ? 'mechanic' : 'customer'}
                  </Typography>
                  <div>
                    {isMechanic ? <RegisterMechanic profile /> : <RegisterClient profile />}
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={1}>
              <Button onClick={handleClose}>x</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </React.Fragment >
  )
}
export default Profile;
