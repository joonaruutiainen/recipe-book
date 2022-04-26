import React from 'react';

export interface NotificationProps {
  message: string;
  color: string;
  details?: [string];
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, color, details, onClose }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: 'fit-content',
      height: 'fit-content',
      color: 'white',
      backgroundColor: color,
      borderRadius: '5px',
      padding: '5px 10px',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '30px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: '1 1 auto',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {message}
      </div>
      {onClose && (
        <button
          type='button'
          onClick={onClose}
          style={{ color: 'white', backgroundColor: 'transparent', border: 'none' }}
        >
          &#10006;
        </button>
      )}
    </div>
    {details &&
      details.map(msg => (
        <div style={{ color: 'white' }} key={msg}>
          {msg}
        </div>
      ))}
  </div>
);

export default Notification;
