import './Navbar.scss';
import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Home from '../containers/clientSide/Home';
import FindMechanic from '../containers/clientSide/FindMechanic';
import FixYourself from '../containers/clientSide/FixYourself';
import Offers from '../containers/mechanicSide/Offers';
import Feedback from '../containers/mechanicSide/Feedback';
import LoginAndRegister from '../containers/LoginAndRegister';
import Profile from '../containers/Profile/Profile';
import AppointmentProcess from '../containers/clientSide/AppointmentProcess/AppointmentProcess';

function CustomNavbar() {
  const [clientMode, setClientMode] = useState(true);
  const [openLogin, setOpenLogin] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const logedIn = localStorage.getItem('token') ? true : false;
  useEffect(() => {
    const { isMechanic = false } = JSON.parse(localStorage.getItem('user') || '{}');
    setClientMode(!isMechanic);
  }, [logedIn]);
  return (
    <Router>
      {clientMode ?
        <Navbar className="custom-navbar" bg='light' expand='lg'>
          <Navbar.Brand href='#home'>myMechanic</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='m-auto'>
              <Nav.Link className="m-3" href="/home">Home</Nav.Link>
              <Nav.Link className="m-3" href="/findMechanic">Find a mechanic for you</Nav.Link>
              <Nav.Link className="m-3" href="/fixYourself">Fix it yourself</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Nav>
            {!logedIn &&
              <>
                <Button variant="contained" onClick={() => setClientMode(!clientMode)}>I am a mechanic</Button>
                <a href="#login" className="nav-link active pointer" onClick={() => setOpenLogin(!openLogin)}>
                  Log in
                </a>
              </>
            }
            {logedIn &&
              <a href="#profile" className="nav-link active pointer" onClick={() => setOpenProfile(!openProfile)}>
                <AccountCircle />
              </a>
            }
          </Nav>
        </Navbar>
        :
        <Navbar className="custom-navbar" bg='dark' expand='lg' variant="dark">
          <Navbar.Brand href='#home'>myMechanic</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='m-auto'>
              <Nav.Link className="m-3" href="/home">Appointments</Nav.Link>
              <Nav.Link className="m-3" href="/newJobs">New Jobs</Nav.Link>
              <Nav.Link className="m-3" href="/feedback">Your feedback</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Nav>
            {!logedIn &&
              <>
                <Button variant="contained" onClick={() => setClientMode(!clientMode)}>I am looking for a mechanic</Button>
                <a href="#login" className="nav-link active pointer" onClick={() => setOpenLogin(!openLogin)}>
                  {logedIn ? <AccountCircle /> : 'Log in'}
                </a>
              </>
            }
            {logedIn &&
              <a href="#login" className="nav-link active pointer" onClick={() => setOpenProfile(!openProfile)}>
                <AccountCircle />
              </a>
            }
          </Nav>
        </Navbar>
      }
      <Switch>
        <Route path="/findMechanic">
          <FindMechanic />
        </Route>
        <Route path="/fixYourself">
          <FixYourself />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/newJobs">
          <Offers />
        </Route>
        <Route path="/feedback">
          <Feedback />
        </Route>
        <Route path="/appointmentProcess"
          render={(props) => <AppointmentProcess {...props} />}
        />
      </Switch>
      <LoginAndRegister open={openLogin} onClose={() => setOpenLogin(false)} />
      <Profile open={openProfile} onClose={() => setOpenProfile(false)} />
    </Router>
  )
}
export default CustomNavbar;
