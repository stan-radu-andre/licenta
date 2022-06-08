import React from 'react';
import { Card, CardContent } from '@mui/material';
import CustomMechanicCard from './customMechanicCard';

function MechanicsCards(props) {
  const { mechanics = [] } = props;
  console.log(mechanics);
  return (
    <>
      <Card>
        <CardContent>
          {mechanics &&
            mechanics
              .map((mechanic) => (<CustomMechanicCard key={mechanic._id} mechanic={mechanic} />))
          }
        </CardContent>
      </Card>
    </>
  )
}

export default MechanicsCards;
