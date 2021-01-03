import React from "react";

const NotificationModalWithButton = ({ notification, handleCloseNotificationModal, logoutFromModal }) => {
  return (
    <div className="notificationModal__wrapper">
      <div className="notificationModal__content">
        <p>{notification}</p>
        <button onClick={logoutFromModal}>Logout</button>
        <button className="cancel" onClick={handleCloseNotificationModal}>Cancel</button>
      </div>
    </div>
  );
};
  
export default NotificationModalWithButton;
