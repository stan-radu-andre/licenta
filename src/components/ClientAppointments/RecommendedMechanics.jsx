import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardContent, CardHeader, Avatar, Button, Modal, Box, Typography } from '@mui/material';
import OrderModal from '../Booking/OrderModal';
import CustomMechanicCard from './Cards/customMechanicCard';
import { blue } from '@mui/material/colors';

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

function RecommendedMechanics(props) {
  const { mechanics = [], appointment } = props;
  const history = useHistory();
  const [opendModal, setModalOpen] = useState({ open: false, mechanic: {} });
  const [informatinalModal, setInformatinalModal] = useState(false);


  const handleMakeUnassignedOrder = () => {
    setModalOpen({ open: true, mechanic: {} });
  }
  const handleClose = () => {
    setModalOpen({ open: false, mechanic: {} });
  };
  const handleSumbitOrder = () => {
    setModalOpen({ open: false, mechanic: {} });
    setInformatinalModal(true);
  }

  const handleInformatinalClose = () => {
    setInformatinalModal(false);
    history.push('/home');
  };

  if (!mechanics.length) return <></>
  return (
    <>
      <Card className='card-max-width'>
        <CardContent>
          <Card className='order-card mt-2' variant="outlined">
            {/* sursa: https://mui.com/material-ui/react-card/ */}
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: blue[200] }} aria-label="mechanic">
                  O
                </Avatar>
              }
              action={
                (
                  <>
                    <Button className="p-3" variant="outlined" onClick={handleMakeUnassignedOrder}>Make an order</Button>
                  </>
                )
              }
              title={"Make an order"}
              subheader='If you are not sure about the work on your car, you can make an order and a mechanic will pick up your request'
            />
          </Card>
          <Typography textAlign={'left'} className="mt-3" paragraph>This are, in order, our recommendations:</Typography>
          {mechanics
            .map((mechanic, index) => (<CustomMechanicCard key={mechanic._id} order={index + 1} mechanic={mechanic} handleSelectMechanic={(mechanic) => setModalOpen({ open: true, mechanic })} />))
          }
        </CardContent>
      </Card>
      <OrderModal
        opendModal={opendModal.open}
        handleClose={handleClose}
        appointment={appointment}
        handleSumbitOrder={handleSumbitOrder}
        mechanic={opendModal.mechanic}
      />
      <Modal
        open={informatinalModal}
        onClose={handleInformatinalClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="d-flex justify-content-end"><Button id="modal-close-button" onClick={handleInformatinalClose}>X</Button></div>
          <p id="child-modal-description">
            Your order will appear on the home page and on the calendar once it's accepted by the mechanic.
          </p>
        </Box>
      </Modal>
    </>
  )
}

export default RecommendedMechanics;
