import React, { useState, useEffect } from 'react';
import { Button, Modal, Box } from '@mui/material';

// sursa: https://mui.com/material-ui/react-modal/
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: '5px'
};

export default function MessageModal({ message }) {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (message) {
      setOpenModal(true);
    }
  }, [message]);

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style }}>
        <div className="d-flex justify-content-end"><Button id="modal-close-button" onClick={() => setOpenModal(false)}>X</Button></div>
        <p className='ml-5 mr-5' id="child-modal-description">
          {message}
        </p>
      </Box>
    </Modal >
  )
}