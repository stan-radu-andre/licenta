import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import './styles.scss';

export default function Alerts({ messages = [] }) {
  const orientation = {
    vertical: 'top',
    horizontal: 'center',
  };
  const [stateMessages, setMessages] = useState([]);
  const handleClose = (index) => (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    messages[index].open = false;
    setMessages({
      messages
    })
  };

  useEffect(() => {
    const mappedMessages = messages.map(message => ({ open: true, ...message }));
    setMessages(mappedMessages);
  }, [messages]);

  const showMessage = (message, index) => {
    console.log('message', message);
    switch (message.type) {
      case 'error':
        return (
          <Snackbar open={message.open} autoHideDurtion={6000} onClose={handleClose(index)} anchorOrigin={orientation} key={index}>
            <Alert severity="error" onClose={handleClose(index)}>
              <AlertTitle>Error</AlertTitle>
              {message.message}
            </Alert>
          </Snackbar>
        );
      case 'warning':
        return (
          <Snackbar open={message.open} autoHideDurtion={6000} onClose={handleClose(index)} anchorOrigin={orientation} key={index}>
            <Alert severity="warning" onClose={handleClose(index)}>
              <AlertTitle>Warning</AlertTitle>
              {message.message}
            </Alert>
          </Snackbar>
        );
      case 'success':
        return (
          <Snackbar autoHideDurtion={4000} open={message.open} onClose={handleClose(index)} anchorOrigin={orientation} key={index}>
            <Alert severity="success" onClose={handleClose(index)}>
              <AlertTitle>Success</AlertTitle>
              {message.message}
            </Alert>
          </Snackbar>
        );
      case 'info':
      default:
        return (
          <Snackbar open={message.open} autoHideDurtion={6000} onClose={handleClose(index)} anchorOrigin={orientation} key={index}>
            <Alert severity="info" onClose={handleClose(index)}>
              <AlertTitle>Info</AlertTitle>
              {message.message}
            </Alert>
          </Snackbar>
        );
    }
  }

  return (
    <div className='alerts-container'>
      <Stack sx={{ width: '100%' }} spacing={2}>
        {stateMessages.length > 0 && stateMessages.map((message, index) => showMessage(message, index))}
      </Stack>
    </div>
  );
}