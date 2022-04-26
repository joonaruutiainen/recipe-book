import React from 'react';

export interface CardContainerProps {
  width: string;
  height: string;
  children?: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({ width, height, children }) => (
  <div
    style={{
      width,
      height,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      borderRadius: '7px',
      backgroundColor: 'white',
      boxShadow: '2px 3px 15px 2px rgba(57, 53, 44, 0.6)',
    }}
  >
    {children}
  </div>
);

export default CardContainer;
