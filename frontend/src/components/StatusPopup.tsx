import React from 'react';
import '../App.css'; // Import App.css for styling

interface StatusPopupProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const StatusPopup: React.FC<StatusPopupProps> = ({ message, type, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className={`popup-content popup-${type}`}>
        <button className="popup-close" onClick={onClose}>&times;</button>
        <p className="popup-message">{message}</p>
      </div>
    </div>
  );
};

export default StatusPopup;