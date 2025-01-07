import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNotifications } from '../context/Notification';

// export const NotificationsToast: React.FC = () => {
//   const { notifications, showToasts, toggleToasts, markAsRead } = useNotifications();

//   return (
//     <ToastContainer position="top-end" className="p-3">
//       {notifications.map((notification) => (
//         <Toast
//           key={notification.id}
//           onClose={() => markAsRead(notification.id)}
//           show={showToasts}
//           delay={5000}
//           autohide
//         >
//           <Toast.Header>
//             <strong className="me-auto">Notification</strong>
//             <small className="text-muted">{new Date(notification.created_at).toLocaleTimeString()}</small>
//           </Toast.Header>
//           <Toast.Body>{notification.message}</Toast.Body>
//         </Toast>
//       ))}
//       {notifications.length > 0 && (
//         <button
//           className="btn btn-link text-decoration-none"
//           onClick={toggleToasts}
//         >
//           {showToasts ? 'Hide Notifications' : 'Show Notifications'}
//         </button>
//       )}
//     </ToastContainer>
//   );
// };
