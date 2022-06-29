import './Home.scss';
import React, { useState, useEffect } from 'react';
import { Grid, Box, Tab, Tabs } from '@mui/material';
// sursa pozei fara licenta: https://pixabay.com/photos/auto-car-garage-auto-shop-vintage-1868726/
import mechanicPhoto from '../../assets/mechanicPhoto.jpg';
import BookingCalendar from '../../components/Booking/BookingCalendar';
import NewAppointmentsTab from '../clientSide/Appointments/NewAppointmentsTab';
import BookedAppointmentsTab from '../clientSide/Appointments/BookedAppointmentsTab';
import NewJobsTab from '../mechanicSide/Appointments/NewJobsTab';
import BookedJobsTab from '../mechanicSide/Appointments/BookedJobsTab';
import { getRequest } from '../../utils/requests';

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
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Home() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { isMechanic } = user;
  const [stateAppointments, setAppointments] = useState([]);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [calendarHeight, setCalendarHeight] = useState(500);
  const calendar = document.getElementsByClassName('fc-view-harness-active');
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      getRequest(`http://localhost:4000/appointments/${user.isMechanic ? 'mechanic' : 'client'}/${user._id}/booked/`)
        .then((response) => {
          const { appointments } = response.data;
          setAppointments(appointments);
        })
    }
  }, [])
  useEffect(() => {
    setCalendarHeight(calendar[0]?.style.height.split(".")[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarHeight]);
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
          style={{ height: `${parseInt(calendarHeight) + 217}px` }}
        >
          <Grid item xs={7} md={8}>
            <div id="calendar-container" className="home-calendar">
              <BookingCalendar
                appointments={stateAppointments || []}
                isMechanic={isMechanic}
                setBookedAppointment={setBookedAppointment}
              />
            </div>
          </Grid>
          <Grid item xs={4} className="calendar-cards">
            <Box className="home-calendar calendar-cards" sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label={isMechanic ? 'New Jobs' : 'New appointments'} {...a11yProps(0)} />
                  <Tab label="Booked appointments" {...a11yProps(1)} />
                </Tabs>
              </Box>
              {isMechanic ? (
                <>
                  <TabPanel value={tabValue} index={0}>
                    <NewJobsTab bookedAppointment={bookedAppointment} />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <BookedJobsTab />
                  </TabPanel>
                </>)
                :
                (<>
                  <TabPanel value={tabValue} index={0}>
                    <NewAppointmentsTab />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <BookedAppointmentsTab />
                  </TabPanel>
                </>)
              }
            </Box>
          </Grid>
        </Grid>
      }
    </div>
  )
}
export default Home;
