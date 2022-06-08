import './Home.scss';
import React, { useState, useEffect } from 'react';
import { Grid, Box, Tab, Tabs, Typography } from '@mui/material';
import mechanicPhoto from '../../../assets/mechanicPhoto.jpg';
import BookingCalendar from '../../../components/Booking/BookingCalendar';
import { getRequest } from '../../../utils/requests';

// sursa: https://mui.com/material-ui/react-tabs/#main-content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Home() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { isMechanic } = user;
  const [stateAppointments, setAppointments] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      getRequest(`http://localhost:4000/users/appointments/${user._id}`)
        .then((response) => {
          const { appointments } = response.data;
          setAppointments(appointments);
        })
    }
  }, [])
  // sursa: https://mui.com/material-ui/react-tabs/#main-content
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <div className='home-image' style={{ backgroundImage: "url(" + mechanicPhoto + ")" }}>
      {user._id &&
        <Grid direction="row"
          justifyContent="center"
          container
          className='p-5'
          spacing={2}
        >
          <Grid item xs={8} md={8}>
            <div className="home-calendar">
              <BookingCalendar
                appointments={stateAppointments || []}
                isMechanic={isMechanic}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <Box className="home-calendar" sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label={isMechanic ? 'New Jobs' : 'New appointments'} {...a11yProps(0)} />
                  <Tab label="Booked appointments" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                Item One
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                Item Two
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      }
    </div>
  )
}
export default Home;
