import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Box,
  Modal,
  Tabs,
  Tab,
} from '@mui/material';
import Login from '../components/Login/login';
import RegisterClient from '../components/Login/registerClient';
import RegisterMechanic from '../components/Login/registerMechanic';

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

function LoginAndRegister({ open, onClose }) {
  // const handleOpen = () => {
  //     setOpen(true);
  // };
  const [tab, setTab] = useState(0);

  const handleClose = () => {
    onClose();
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 'fit-content', maxWidth: '800px' }}>
          <Grid container spacing={2}>
            <Grid item xs={11}>
              <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Login" {...a11yProps(0)} />
                <Tab label="Register as client" {...a11yProps(1)} />
                <Tab label="Register as mechanic" {...a11yProps(2)} />
              </Tabs>
            </Grid>
            <Grid item xs={1}>
              <Button onClick={handleClose}>x</Button>
            </Grid>
          </Grid>
          <Login value={tab} index={0} />
          <RegisterClient value={tab} index={1} />
          <RegisterMechanic value={tab} index={2} />
        </Box>
      </Modal>
    </React.Fragment >
  )
}
export default LoginAndRegister;
